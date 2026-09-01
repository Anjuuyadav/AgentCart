import { aiRepository, auditRepository } from '../repositories/commonRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import type { AISession, AIAction, BuyerRequirements } from '../types/index.js';

const VALID_SESSION_TYPES = ['buyer', 'merchant'] as const;
const VALID_ACTION_TYPES = ['search', 'view', 'cart', 'purchase', 'compare', 'analyze', 'recommend'] as const;

export const aiSessionService = {
  async createSession(params: {
    userId?: string;
    sessionType: AISession['sessionType'];
    initialQuery?: string;
    requirements?: BuyerRequirements;
  }): Promise<AISession & { actions: AIAction[] }> {
    const errors: Record<string, string[]> = {};

    if (!VALID_SESSION_TYPES.includes(params.sessionType)) {
      errors.sessionType = [`Must be one of: ${VALID_SESSION_TYPES.join(', ')}`];
    }

    if (params.requirements && typeof params.requirements !== 'object') {
      errors.requirements = ['Must be an object'];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid AI session payload', errors);
    }

    const resolvedUserId = params.userId || await userRepository.ensureDemoUser(
      'demo.customer@agentcart.io',
      'Demo Customer',
    );

    const session = await aiRepository.createSession({
      userId: resolvedUserId,
      sessionType: params.sessionType,
      initialQuery: params.initialQuery,
      requirements: params.requirements,
    });

    await auditRepository.create({
      actor: params.sessionType === 'buyer' ? 'ai_buyer' : 'ai_merchant',
      actorId: resolvedUserId,
      event: `ai_session.${params.sessionType}.created`,
      status: 'success',
      metadata: {
        sessionId: session.id,
        initialQuery: params.initialQuery,
      },
    });

    return { ...session, actions: [] };
  },

  async getSession(sessionId: string): Promise<AISession & { actions: AIAction[] }> {
    const session = await aiRepository.getSessionById(sessionId);
    if (!session) {
      throw new NotFoundError('AI session', sessionId);
    }
    return session;
  },

  async recordAction(params: {
    sessionId: string;
    actionType: AIAction['actionType'];
    query?: string;
    productId?: string;
    productName?: string;
    matchScore?: number;
    revenue?: number;
    metadata?: Record<string, unknown>;
  }): Promise<AIAction> {
    const errors: Record<string, string[]> = {};

    if (!VALID_ACTION_TYPES.includes(params.actionType)) {
      errors.actionType = [`Must be one of: ${VALID_ACTION_TYPES.join(', ')}`];
    }

    if (params.matchScore !== undefined) {
      if (typeof params.matchScore !== 'number' || params.matchScore < 0 || params.matchScore > 100) {
        errors.matchScore = ['Must be a number between 0 and 100'];
      }
    }

    if (params.revenue !== undefined) {
      if (typeof params.revenue !== 'number' || params.revenue < 0 || !Number.isFinite(params.revenue)) {
        errors.revenue = ['Must be a non-negative number'];
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Invalid AI action payload', errors);
    }

    const session = await aiRepository.getSessionById(params.sessionId);
    if (!session) {
      throw new NotFoundError('AI session', params.sessionId);
    }

    const action = await aiRepository.createAction({
      aiSessionId: params.sessionId,
      userId: session.userId,
      actionType: params.actionType,
      query: params.query,
      productId: params.productId,
      productName: params.productName,
      matchScore: params.matchScore,
      revenue: params.revenue,
      metadata: params.metadata,
    });

    await auditRepository.create({
      actor: session.sessionType === 'buyer' ? 'ai_buyer' : 'ai_merchant',
      actorId: session.userId,
      event: `ai_action.${params.actionType}`,
      status: 'success',
      relatedProductId: params.productId,
      relatedProductName: params.productName,
      metadata: {
        sessionId: params.sessionId,
        query: params.query,
        matchScore: params.matchScore,
        ...(params.metadata || {}),
      },
    });

    return action;
  },
};
