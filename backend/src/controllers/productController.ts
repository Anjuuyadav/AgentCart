import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { validateProductQuery, validateProductId } from '../validators/index.js';

export const productController = {
  async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const params = validateProductQuery(req.query as unknown as Record<string, unknown>);
      const { products, total } = await productService.list(params, req.demo?.userId);
      res.sendData(products, {
        total,
        limit: params.limit,
        offset: params.offset,
        page: Math.floor(params.offset / params.limit) + 1,
      });
    } catch (err) {
      next(err);
    }
  },

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = validateProductId(req.params.id);
      const product = await productService.getById(id, req.demo?.userId);
      res.sendData(product);
    } catch (err) {
      next(err);
    }
  },

  async getProductVariants(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = validateProductId(req.params.id);
      const variants = await productService.getVariants(productId);
      res.sendData(variants);
    } catch (err) {
      next(err);
    }
  },
};
