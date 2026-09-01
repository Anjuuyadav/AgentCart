import { Request, Response, NextFunction } from 'express';
import { inventoryService } from '../services/inventoryService.js';
import { validateProductId } from '../validators/index.js';

export const inventoryController = {
  async listAllInventory(_req: Request, res: Response, next: NextFunction) {
    try {
      const items = await inventoryService.listAll();
      res.sendData(items);
    } catch (err) {
      next(err);
    }
  },

  async getInventoryForProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = validateProductId(req.params.productId);
      const result = await inventoryService.listByProduct(productId);
      res.sendData(result);
    } catch (err) {
      next(err);
    }
  },
};
