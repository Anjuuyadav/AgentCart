import { Request, Response, NextFunction } from 'express';
import { purchasePolicyService } from '../services/purchasePolicyService.js';
import { validatePositiveNumber, validateProductId } from '../validators/index.js';
import { ValidationError } from '../middleware/errorHandler.js';
import type { EvaluatePolicyRequest } from '../types/index.js';

function validateEvaluatePayload(body: Record<string, unknown>): EvaluatePolicyRequest {
  const errors: Record<string, string[]> = {};
  const result: Partial<EvaluatePolicyRequest> = {};

  let hasProduct = false;
  if (body.productId !== undefined && body.productId !== null && String(body.productId).trim() !== '') {
    try {
      result.productId = validateProductId(body.productId);
      hasProduct = true;
    } catch (e) {
      Object.assign(errors, (e as ValidationError).details || {});
    }
  }

  if (body.cartId !== undefined && body.cartId !== null && String(body.cartId).trim() !== '') {
    result.cartId = String(body.cartId);
  }

  if (!hasProduct && !result.cartId) {
    errors.productId = errors.productId || [];
    errors.productId.push('Either productId or cartId is required');
  }

  try {
    result.budget = validatePositiveNumber(body.budget ?? body.budgetLimit ?? 0, 'budget');
  } catch (e) {
    Object.assign(errors, (e as ValidationError).details || {});
  }

  if (body.size !== undefined && body.size !== null) {
    result.size = String(body.size);
  }
  if (body.color !== undefined && body.color !== null) {
    result.color = String(body.color);
  }
  if (body.autoApproveUnderBudget !== undefined && typeof body.autoApproveUnderBudget === 'boolean') {
    result.autoApproveUnderBudget = body.autoApproveUnderBudget;
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Invalid policy evaluation payload', errors);
  }

  return result as EvaluatePolicyRequest;
}

export const purchasePolicyController = {
  async getPolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const policy = await purchasePolicyService.getLatest(req.demo!.userId);
      res.sendData(policy);
    } catch (err) {
      next(err);
    }
  },

  async evaluatePolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = validateEvaluatePayload(req.body as Record<string, unknown>);
      const policy = await purchasePolicyService.evaluate(
        req.demo!.userId,
        payload,
      );
      res.sendData(policy);
    } catch (err) {
      next(err);
    }
  },
};
