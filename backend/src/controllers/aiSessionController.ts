import { Request, Response, NextFunction } from 'express';
import { aiSessionService } from '../services/aiSessionService.js';
import { ValidationError } from '../middleware/errorHandler.js';
import { isUUID, isNonEmptyString, validateUUID } from '../validators/index.js';
import type { AISession, BuyerRequirements } from '../types/index.js';

function validateSessionType(value: unknown): AISession['sessionType'] {
  if (value !== 'buyer' && value !== 'merchant') {
    throw new ValidationError('Invalid sessionType', {
      sessionType: ['Must be "buyer" or "merchant"'],
    });
  }
  return value;
}

function validateActionType(value: unknown): import('../types/index.js').AIAction['actionType'] {
  const allowed = ['search', 'view', 'cart', 'purchase', 'compare', 'analyze', 'recommend'] as const;
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    throw new ValidationError('Invalid actionType', {
      actionType: [`Must be one of: ${allowed.join(', ')}`],
    });
  }
  return value as import('../types/index.js').AIAction['actionType'];
}

export const aiSessionController = {
  async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;
      const sessionType = validateSessionType(body.sessionType);
      const initialQuery = body.initialQuery !== undefined && body.initialQuery !== null
        ? String(body.initialQuery)
        : undefined;

      let requirements: BuyerRequirements | undefined;
      if (body.requirements !== undefined && body.requirements !== null) {
        if (typeof body.requirements !== 'object' || body.requirements === null) {
          throw new ValidationError('requirements must be an object', {
            requirements: ['Must be an object'],
          });
        }
        requirements = body.requirements as BuyerRequirements;
      }

      const session = await aiSessionService.createSession({
        userId: req.demo?.userId,
        sessionType,
        initialQuery,
        requirements,
      });

      res.sendCreated(session, `/api/ai/sessions/${session.id}`);
    } catch (err) {
      next(err);
    }
  },

  async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = validateUUID(req.params.id);
      const session = await aiSessionService.getSession(sessionId);
      res.sendData(session);
    } catch (err) {
      next(err);
    }
  },

  async recordAction(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = validateUUID(req.params.id);
      const body = req.body as Record<string, unknown>;

      const actionType = validateActionType(body.actionType);

      const payload: {
        sessionId: string;
        actionType: import('../types/index.js').AIAction['actionType'];
        query?: string;
        productId?: string;
        productName?: string;
        matchScore?: number;
        revenue?: number;
        metadata?: Record<string, unknown>;
      } = {
        sessionId,
        actionType,
      };

      if (body.query !== undefined && body.query !== null && String(body.query).trim() !== '') {
        payload.query = String(body.query);
      }
      if (body.productId !== undefined && body.productId !== null && isNonEmptyString(body.productId)) {
        payload.productId = String(body.productId);
      }
      if (body.productName !== undefined && body.productName !== null) {
        payload.productName = String(body.productName);
      }
      if (body.matchScore !== undefined && body.matchScore !== null) {
        const n = typeof body.matchScore === 'string' ? parseFloat(body.matchScore) : body.matchScore;
        if (typeof n === 'number' && !isNaN(n)) {
          payload.matchScore = n;
        }
      }
      if (body.revenue !== undefined && body.revenue !== null) {
        const n = typeof body.revenue === 'string' ? parseFloat(body.revenue) : body.revenue;
        if (typeof n === 'number' && !isNaN(n) && n >= 0) {
          payload.revenue = n;
        }
      }
      if (body.metadata !== undefined && body.metadata !== null && typeof body.metadata === 'object') {
        payload.metadata = body.metadata as Record<string, unknown>;
      }

      const action = await aiSessionService.recordAction(payload);
      res.sendCreated(action);
    } catch (err) {
      next(err);
    }
  },
};
