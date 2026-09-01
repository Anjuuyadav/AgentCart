import { inventoryRepository } from '../repositories/inventoryRepository.js';
import { productRepository } from '../repositories/productRepository.js';
import { NotFoundError, ConflictError } from '../middleware/errorHandler.js';
import type { InventoryItem } from '../types/index.js';

export const inventoryService = {
  async listAll(): Promise<InventoryItem[]> {
    return inventoryRepository.findAll();
  },

  async listByProduct(productId: string): Promise<{ product: Record<string, unknown>; inventory: InventoryItem[] }> {
    const product = await productRepository.findBasicById(productId);
    if (!product) {
      throw new NotFoundError('Product', productId);
    }

    const inventory = await inventoryRepository.findByProductId(productId);

    return {
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      inventory,
    };
  },

  async checkAvailability(
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ): Promise<{
    available: boolean;
    availableQuantity: number;
    variantId: string | null;
    unitPrice: number | null;
  }> {
    const avail = await inventoryRepository.getAvailability(productId, size, color);
    const available = avail.available >= quantity;
    return {
      available,
      availableQuantity: avail.available,
      variantId: avail.variantId,
      unitPrice: avail.unitPrice,
    };
  },

  async ensureAvailabilityOrThrow(
    productId: string,
    size: string,
    color: string,
    quantity: number,
  ): Promise<{ variantId: string; unitPrice: number }> {
    const avail = await inventoryRepository.getAvailability(productId, size, color);

    if (avail.variantId === null || avail.unitPrice === null) {
      throw new NotFoundError(
        `Variant for ${productId} (size=${size}, color=${color}) not found`,
      );
    }

    if (avail.available < quantity) {
      throw new ConflictError(
        `Insufficient inventory: requested ${quantity}, available ${avail.available}`,
        'INSUFFICIENT_STOCK',
      );
    }

    return {
      variantId: avail.variantId,
      unitPrice: avail.unitPrice,
    };
  },
};
