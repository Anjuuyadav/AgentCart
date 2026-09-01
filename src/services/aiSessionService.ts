import { apiClient } from './apiClient';
import type { CreateAISessionPayload, RecordAIActionPayload } from './apiTypes';

export interface AISession {
  id: string;
  userId?: string;
  sessionType: 'buyer' | 'merchant';
  initialQuery?: string;
  requirements?: {
    occasion?: string;
    budget?: number;
    size?: string;
    color?: string;
    category?: string;
  };
  status?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt?: string;
}

export interface AIAction {
  id: string;
  aiSessionId?: string;
  userId?: string;
  actionType: 'search' | 'view' | 'cart' | 'purchase' | 'compare' | 'analyze' | 'recommend';
  query?: string;
  productId?: string;
  productName?: string;
  matchScore?: number;
  revenue?: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export const aiSessionService = {
  async createSession(payload: CreateAISessionPayload): Promise<AISession> {
    return apiClient.post<AISession>('/ai/sessions', payload);
  },

  async getSession(sessionId: string): Promise<AISession> {
    return apiClient.get<AISession>(`/ai/sessions/${encodeURIComponent(sessionId)}`);
  },

  async recordAction(sessionId: string, payload: RecordAIActionPayload): Promise<AIAction> {
    return apiClient.post<AIAction>(`/ai/sessions/${encodeURIComponent(sessionId)}/actions`, payload);
  },
};
