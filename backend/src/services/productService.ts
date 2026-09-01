import { productRepository } from '../repositories/productRepository.js';
import { auditRepository } from '../repositories/commonRepository.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import type { Product } from '../types/index.js';
import { ProductQueryParams } from '../validators/index.js';


export const productService = {
  async list(params: ProductQueryParams, actorId?: string): Promise<{ products: Product[]; total: number }> {
    const result = await productRepository.findMany(params);
    return result;
  },

  async getById(id: string, actorId?: string): Promise<Product> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }

    await auditRepository.create({
      actor: 'customer',
      actorId,
      event: 'product.viewed',
      status: 'success',
      relatedProductId: product.id,
      relatedProductName: product.name,
      metadata: { source: 'products_api' },
    });

    return product;
  },

  async getVariants(productId: string): Promise<Product['variants']> {
    const product = await productRepository.findBasicById(productId);
    if (!product) {
      throw new NotFoundError('Product', productId);
    }
    return productRepository.findVariantsByProductId(productId);
  },

  async getBasicOrThrow(productId: string): Promise<Product> {
    const product = await productRepository.findBasicById(productId);
    if (!product) {
      throw new NotFoundError('Product', productId);
    }
    return product;
  },
};
