import { orderRepository } from '../repositories/orderRepository.js';
import { cartRepository } from '../repositories/cartRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { auditRepository } from '../repositories/commonRepository.js';
import { inventoryService } from './inventoryService.js';
import { productRepository } from '../repositories/productRepository.js';
import { NotFoundError, ConflictError, ValidationError } from '../middleware/errorHandler.js';
import type { Order, OrderItem, OrderTimelineEvent, CreateOrderRequest } from '../types/index.js';
import { n8nService } from './n8nService.js';

function buildTimeline(): OrderTimelineEvent[] {
  const now = new Date();
  return [
    { id: 't1', label: 'Order Placed', timestamp: now, status: 'completed' },
    { id: 't2', label: 'Payment Confirmed', timestamp: now, status: 'completed' },
    { id: 't3', label: 'Processing', timestamp: now, status: 'current' },
    { id: 't4', label: 'Shipped', timestamp: now, status: 'pending' },
    { id: 't5', label: 'Delivered', timestamp: now, status: 'pending' },
  ];
}

function toISO(obj: OrderTimelineEvent): Record<string, unknown> {
  return {
    id: obj.id,
    label: obj.label,
    timestamp: obj.timestamp.toISOString(),
    status: obj.status,
  };
}

export const orderService = {
  async list(userId: string, sessionId: string): Promise<Order[]> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );
    return orderRepository.findByUser(resolvedUserId);
  },

  async getById(userId: string, sessionId: string, idOrNumber: string): Promise<Order> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    const order = await orderRepository.getOrderByIdOrNumber(idOrNumber);
    if (!order) {
      throw new NotFoundError('Order', idOrNumber);
    }
    return order;
  },

  async createFromCart(
    userId: string,
    sessionId: string,
    input: CreateOrderRequest,
  ): Promise<Order> {
    const resolvedUserId = await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
      input.shippingAddress,
    );

    const cart = await cartRepository.findActiveByUserOrSession(resolvedUserId, sessionId);
    if (!cart || !cart.id) {
      throw new ValidationError('Cannot create order: no active cart found. Add items first.');
    }
    if (cart.items.length === 0) {
      throw new ValidationError('Cannot create order: cart is empty.');
    }

    const validationErrors: Record<string, string[]> = {};
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of cart.items) {
      try {
        const { variantId, unitPrice } = await inventoryService.ensureAvailabilityOrThrow(
          item.productId,
          item.size || '',
          item.color || '',
          item.quantity,
        );

        const product = await productRepository.findBasicById(item.productId);
        if (!product) {
          validationErrors[`item_${item.id || item.productId}`] = [`Product ${item.productId} not found`];
          continue;
        }

        const lineTotal = unitPrice * item.quantity;
        total += lineTotal;

        orderItems.push({
          productId: item.productId,
          variantId,
          quantity: item.quantity,
          unitPrice,
          productName: product.name,
          productImage: product.image,
          size: item.size,
          color: item.color,
        });
      } catch (err) {
        const e = err as Error;
        validationErrors[`item_${item.id || item.productId}`] = [e.message];
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new ConflictError('Some cart items failed validation', 'CART_VALIDATION_FAILED');
    }

    const orderNumber = await orderRepository.getNextOrderNumber();
    const timeline = buildTimeline();
    const timelineJson = timeline.map(toISO);

    const order = await orderRepository.create({
      orderNumber,
      userId: resolvedUserId,
      cartId: cart.id,
      totalAmount: total,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      shippingAddress: input.shippingAddress,
      isAiBuyerOrder: input.isAiBuyerOrder ?? false,
      aiMatchScore: input.aiMatchScore,
      timelineJson,
      items: orderItems,
    });

    await cartRepository.markCheckedOut(cart.id);

    await auditRepository.create({
      actor: input.isAiBuyerOrder ? 'ai_buyer' : 'customer',
      actorId: resolvedUserId,
      event: 'order.created',
      status: 'success',
      relatedOrderId: order.id,
      relatedOrderNumber: order.orderNumber,
      metadata: {
        total,
        itemCount: orderItems.length,
        isAiBuyerOrder: input.isAiBuyerOrder,
      },
    });

    await n8nService.sendEvent('order.created', {
      orderId: order.id!,
      orderNumber: order.orderNumber,
      userId: resolvedUserId,
      amount: order.totalAmount,
      isAIBuyerOrder: order.isAiBuyerOrder,
    }, `order.created:${order.id}`);

    return order;
  },
};
