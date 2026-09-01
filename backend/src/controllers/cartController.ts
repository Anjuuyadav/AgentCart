import { Request, Response, NextFunction } from 'express';
import { cartService } from '../services/cartService.js';
import {
  validateCartItemPayload,
  validateUpdateCartItemPayload,
  validateUUID,
} from '../validators/index.js';
import { ValidationError } from '../middleware/errorHandler.js';

export const cartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getActive(
        req.demo!.userId,
        req.demo!.sessionId,
      );
      res.sendData(cart);
    } catch (err) {
      next(err);
    }
  },

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validateCartItemPayload(req.body as Record<string, unknown>);
      const cart = await cartService.addItem(
        req.demo!.userId,
        req.demo!.sessionId,
        payload,
      );
      res.sendData(cart);
    } catch (err) {
      next(err);
    }
  },

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const itemId = validateUUID(req.params.id, 'cartItemId');
      const payload = validateUpdateCartItemPayload(req.body as Record<string, unknown>);
      if (payload.quantity > 999) {
        throw new ValidationError('Invalid cart item payload', {
          quantity: ['Maximum quantity is 999'],
        });
      }
      const cart = await cartService.updateItemQuantity(
        req.demo!.userId,
        req.demo!.sessionId,
        itemId,
        payload.quantity,
      );
      res.sendData(cart);
    } catch (err) {
      next(err);
    }
  },

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const itemId = validateUUID(req.params.id, 'cartItemId');
      const cart = await cartService.removeItem(
        req.demo!.userId,
        req.demo!.sessionId,
        itemId,
      );
      res.sendData(cart);
    } catch (err) {
      next(err);
    }
  },

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.clear(
        req.demo!.userId,
        req.demo!.sessionId,
      );
      res.sendData(cart);
    } catch (err) {
      next(err);
    }
  },
};
