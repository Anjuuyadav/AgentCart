import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/orderService.js';
import { validateRequired, validateEmail } from '../validators/index.js';
import { ValidationError } from '../middleware/errorHandler.js';
import type { CreateOrderRequest } from '../types/index.js';

function validateCreateOrder(body: Record<string, unknown>): CreateOrderRequest {
  const errors: Record<string, string[]> = {};
  const result: Partial<CreateOrderRequest> = {};

  try {
    result.customerName = validateRequired<string>(body.customerName, 'customerName');
  } catch (e) {
      Object.assign(errors, (e as ValidationError).details || {});
    }

  try {
    result.customerEmail = validateEmail(body.customerEmail, 'customerEmail');
  } catch (e) {
    Object.assign(errors, (e as ValidationError).details || {});
  }

  try {
    result.shippingAddress = validateRequired<string>(body.shippingAddress, 'shippingAddress');
    if (typeof result.shippingAddress === 'string' && result.shippingAddress.trim().length < 10) {
      errors.shippingAddress = errors.shippingAddress || [];
      errors.shippingAddress.push('Must be at least 10 characters');
    }
  } catch (e) {
    Object.assign(errors, (e as ValidationError).details || {});
  }

  if (body.isAiBuyerOrder !== undefined) {
    if (typeof body.isAiBuyerOrder !== 'boolean') {
      errors.isAiBuyerOrder = ['Must be a boolean'];
    } else {
      result.isAiBuyerOrder = body.isAiBuyerOrder;
    }
  }

  if (body.aiMatchScore !== undefined && body.aiMatchScore !== null) {
    const n = typeof body.aiMatchScore === 'string' ? parseFloat(body.aiMatchScore) : body.aiMatchScore;
    if (typeof n !== 'number' || isNaN(n) || n < 0 || n > 100) {
      errors.aiMatchScore = ['Must be a number between 0 and 100'];
    } else {
      result.aiMatchScore = n;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Invalid order payload', errors);
  }

  return result as CreateOrderRequest;
}

export const orderController = {
  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.list(
        req.demo!.userId,
        req.demo!.sessionId,
      );
      res.sendData(orders);
    } catch (err) {
      next(err);
    }
  },

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const idOrNumber = validateRequired<string>(req.params.id, 'orderId');
      const order = await orderService.getById(
        req.demo!.userId,
        req.demo!.sessionId,
        idOrNumber,
      );
      res.sendData(order);
    } catch (err) {
      next(err);
    }
  },

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validateCreateOrder(req.body as Record<string, unknown>);
      const order = await orderService.createFromCart(
        req.demo!.userId,
        req.demo!.sessionId,
        payload,
      );
      res.sendCreated(order, `/api/orders/${order.orderNumber || order.id}`);
    } catch (err) {
      next(err);
    }
  },
};
