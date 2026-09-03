import { cartRepository } from '../repositories/cartRepository.js';
import { productService } from './productService.js';
import { inventoryService } from './inventoryService.js';
import { auditRepository } from '../repositories/commonRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { NotFoundError, ConflictError } from '../middleware/errorHandler.js';
import type { Cart, CartItem } from '../types/index.js';
import { n8nService } from './n8nService.js';

function calculateTotals(cart: Cart): Cart {
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.unitPrice ?? item.productPrice ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return {
    ...cart,
    subtotal,
    total: subtotal,
  };
}

export const cartService = {
  async getOrCreate(userId: string, sessionId: string): Promise<Cart> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    let cart = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    if (!cart) {
      cart = await cartRepository.create(resolvedUserId, sessionId);
      await n8nService.sendEvent('cart.created', {
        cartId: cart.id!,
        userId: resolvedUserId,
        itemCount: 0,
      }, `cart.created:${cart.id}`);
    }
    return calculateTotals(cart);
  },

  async getActive(userId: string, sessionId: string): Promise<Cart> {
    const cart = await this.getOrCreate(userId, sessionId);
    return calculateTotals(cart);
  },

  async addItem(
    userId: string,
    sessionId: string,
    input: {
      productId: string;
      variantId?: string;
      quantity: number;
      size: string;
      color: string;
    },
  ): Promise<Cart> {
    const product = await productService.getBasicOrThrow(input.productId);
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    const { variantId, unitPrice } = await inventoryService.ensureAvailabilityOrThrow(
      input.productId,
      input.size,
      input.color,
      input.quantity,
    );

    let cart = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    if (!cart || !cart.id) {
      cart = await cartRepository.create(resolvedUserId, sessionId);
    }

    const existing = await cartRepository.findCartItemByProductVariant(
      cart.id!,
      input.productId,
      input.size,
      input.color,
    );

    if (existing && existing.id) {
      const newQuantity = existing.quantity + input.quantity;
      const avail = await inventoryService.checkAvailability(
        input.productId,
        input.size,
        input.color,
        newQuantity,
      );
      if (!avail.available) {
        throw new ConflictError(
          `Insufficient inventory for combined quantity ${newQuantity}: only ${avail.availableQuantity} available`,
          'INSUFFICIENT_STOCK',
        );
      }
      await cartRepository.updateItemQuantity(existing.id, newQuantity);
    } else {
      await cartRepository.addItem(cart.id!, {
        productId: input.productId,
        variantId,
        quantity: input.quantity,
        unitPrice,
        size: input.size,
        color: input.color,
      });
    }

    const refreshed = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    const cartId = cart?.id;
    if (!cartId) {
      throw new NotFoundError('Cart');
    }
    const withTotals = calculateTotals(refreshed!);

    await auditRepository.create({
      actor: 'customer',
      actorId: resolvedUserId,
      event: 'cart.item_added',
      status: 'success',
      relatedProductId: product.id,
      relatedProductName: product.name,
      metadata: {
        quantity: input.quantity,
        size: input.size,
        color: input.color,
        cartId,
      },
    });
    await n8nService.sendEvent('cart.updated', {
      cartId,
      userId: resolvedUserId,
      productId: product.id,
      itemCount: withTotals.items.length,
      total: withTotals.total,
    }, `cart.updated:${cartId}:${withTotals.items.length}:${withTotals.total}`);

    return withTotals;
  },

  async updateItemQuantity(
    userId: string,
    sessionId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    const item = await cartRepository.findItemById(cartItemId);
    if (!item) {
      throw new NotFoundError('Cart item', cartItemId);
    }

    const cart = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    if (!cart || cart.id !== item.id) {
      const itemMatch = cart?.items.find((i) => i.id === cartItemId);
      if (!itemMatch) {
        throw new NotFoundError('Cart item', cartItemId);
      }
    }

    const avail = await inventoryService.checkAvailability(
      item.productId,
      item.size || '',
      item.color || '',
      quantity,
    );
    if (!avail.available) {
      throw new ConflictError(
        `Insufficient inventory: requested ${quantity}, available ${avail.availableQuantity}`,
        'INSUFFICIENT_STOCK',
      );
    }

    await cartRepository.updateItemQuantity(cartItemId, quantity);

    const refreshed = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    const cartId = cart?.id;
    if (!cartId) {
      throw new NotFoundError('Cart');
    }

    await auditRepository.create({
      actor: 'customer',
      actorId: resolvedUserId,
      event: 'cart.updated',
      status: 'success',
      relatedProductId: item.productId,
      metadata: {
        cartItemId,
        newQuantity: quantity,
      },
    });
    await n8nService.sendEvent('cart.updated', {
      cartId,
      userId: resolvedUserId,
      productId: item.productId,
      itemCount: refreshed?.items.length || 0,
      total: refreshed?.total || 0,
    }, `cart.updated:${cartId}:${cartItemId}:${quantity}`);

    return calculateTotals(refreshed!);
  },

  async removeItem(
    userId: string,
    sessionId: string,
    cartItemId: string,
  ): Promise<Cart> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    const item = await cartRepository.findItemById(cartItemId);
    if (!item) {
      throw new NotFoundError('Cart item', cartItemId);
    }

    const removed = await cartRepository.removeItem(cartItemId);
    if (!removed) {
      throw new NotFoundError('Cart item', cartItemId);
    }

    const refreshed = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    return calculateTotals(refreshed!);
  },

  async clear(userId: string, sessionId: string): Promise<Cart> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    let cart = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    if (!cart || !cart.id) {
      cart = await cartRepository.create(resolvedUserId, sessionId);
    } else {
      await cartRepository.clearCart(cart.id);
      const refreshed = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
      cart = refreshed!;
    }

    return calculateTotals(cart);
  },
};
