/**
 * AI Buyer Controller
 * 
 * Handles AI Buyer API endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { aiBuyer } from '../services/ai/aiBuyerService.js';
import { ValidationError, BadRequestError } from '../middleware/errorHandler.js';
import { isUUID } from '../validators/index.js';

export const aiBuyerController = {
  /**
   * POST /api/ai/buyer/chat
   * 
   * Main AI Buyer chat endpoint
   * Can start a new session or continue an existing one
   */
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;

      // Validate message
      const message = body.message as string | undefined;
      if (!message || typeof message !== 'string' || message.trim() === '') {
        throw new BadRequestError('Message cannot be empty');
      }

      // Validate session ID if provided
      let sessionId: string | undefined;
      if (body.sessionId !== undefined && body.sessionId !== null) {
        const sid = String(body.sessionId);
        if (sid.trim() === '') {
          throw new BadRequestError('Session ID cannot be empty');
        }
        if (!isUUID(sid)) {
          throw new BadRequestError('Invalid session ID format');
        }
        sessionId = sid;
      }

      // Call AI Buyer
      const result = await aiBuyer.chat({
        userId: req.demo?.userId,
        sessionId,
        message: message.trim(),
      });

      res.sendData(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/ai/buyer/view
   * 
   * Record a product view action for AI tracking
   */
  async recordView(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;

      // Validate session ID
      const sessionId = body.sessionId as string | undefined;
      if (!sessionId || typeof sessionId !== 'string' || !isUUID(sessionId)) {
        throw new BadRequestError('Invalid or missing session ID');
      }

      // Validate product ID
      const productId = body.productId as string | undefined;
      if (!productId || typeof productId !== 'string' || productId.trim() === '') {
        throw new BadRequestError('Invalid or missing product ID');
      }

      // Product name (optional)
      const productName = body.productName ? String(body.productName) : 'Unknown Product';

      // Match score (optional)
      let matchScore: number | undefined;
      if (body.matchScore !== undefined && body.matchScore !== null) {
        const n = typeof body.matchScore === 'string' ? parseFloat(body.matchScore) : body.matchScore;
        if (typeof n === 'number' && !isNaN(n) && n >= 0 && n <= 100) {
          matchScore = n;
        }
      }

      await aiBuyer.recordProductView({
        sessionId,
        productId,
        productName,
        matchScore,
      });

      res.sendData({ success: true });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/ai/buyer/compare
   * 
   * Record product comparison action
   */
  async recordCompare(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as Record<string, unknown>;

      // Validate session ID
      const sessionId = body.sessionId as string | undefined;
      if (!sessionId || typeof sessionId !== 'string' || !isUUID(sessionId)) {
        throw new BadRequestError('Invalid or missing session ID');
      }

      // Validate product IDs
      const productIds = body.productIds as unknown;
      if (!Array.isArray(productIds) || productIds.length === 0) {
        throw new BadRequestError('productIds must be a non-empty array');
      }

      const validProductIds = productIds.filter((id) => typeof id === 'string' && id.trim() !== '');
      if (validProductIds.length === 0) {
        throw new BadRequestError('No valid product IDs provided');
      }

      await aiBuyer.recordProductCompare({
        sessionId,
        productIds: validProductIds,
      });

      res.sendData({ success: true });
    } catch (err) {
      next(err);
    }
  },
};
