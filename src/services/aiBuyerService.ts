/**
 * Frontend AI Buyer Service
 * 
 * Handles communication with the backend AI Buyer API.
 * Never calls the AI provider directly - always goes through backend.
 */

import { apiClient } from './apiClient';

export interface AIBuyerChatRequest {
  sessionId?: string;
  message: string;
}

export interface AIBuyerChatResponse {
  sessionId: string;
  requirements: {
    category?: string;
    occasion?: string;
    budget?: number;
    minPrice?: number;
    size?: string;
    color?: string;
    gender?: string;
    keywords?: string[];
  };
  message: string;
  recommendations: Array<{
    productId: string;
    name: string;
    price: number;
    image: string;
    matchScore: number;
    reasons: string[];
    availableVariants: Array<{
      size: string;
      color: string;
      stock: number;
      sku: string;
    }>;
    available: boolean;
  }>;
  status: 'success' | 'error';
  error?: string;
}

export interface AIActionLogRequest {
  action_type: 'search' | 'view' | 'cart' | 'purchase' | 'compare' | 'analyze' | 'recommend';
  query?: string;
  product_id?: string;
  product_name?: string;
  match_score?: number;
  revenue?: number;
  details?: Record<string, any>;
}

export const aiBuyerService = {
  /**
   * Send a message to the AI Buyer
   * Can start a new session or continue an existing one
   */
  async chat(request: AIBuyerChatRequest): Promise<AIBuyerChatResponse> {
    return apiClient.post<AIBuyerChatResponse>('/ai/buyer/chat', request);
  },

  /**
   * Record a product view action
   */
  async recordView(params: {
    sessionId: string;
    productId: string;
    productName: string;
    matchScore?: number;
  }): Promise<{ success: boolean }> {
    return apiClient.post('/ai/buyer/view', params);
  },

  /**
   * Record a product comparison action
   */
  async recordCompare(params: {
    sessionId: string;
    productIds: string[];
  }): Promise<{ success: boolean }> {
    return apiClient.post('/ai/buyer/compare', params);
  },

  /**
   * Log an AI action (purchase, cart, etc.)
   * Sends to the AI session action logging endpoint
   */
  async logAction(request: AIActionLogRequest): Promise<{ success: boolean; actionId?: string }> {
    try {
      // Get or create a default session ID from localStorage
      let sessionId = localStorage.getItem('aiSessionId');
      if (!sessionId) {
        // If no session exists, create one
        try {
          const response = await apiClient.post('/ai/sessions', {
            sessionType: 'buyer',
            initialQuery: 'AI Buyer Session',
          });
          sessionId = response.id || '';
          if (sessionId) {
            localStorage.setItem('aiSessionId', sessionId);
          }
        } catch {
          // If session creation fails, continue anyway
          sessionId = `session_${Date.now()}`;
          localStorage.setItem('aiSessionId', sessionId);
        }
      }

      // Log the action
      if (sessionId) {
        await apiClient.post(`/ai/sessions/${sessionId}/actions`, {
          actionType: request.action_type,
          query: request.query,
          productId: request.product_id,
          productName: request.product_name,
          matchScore: request.match_score,
          revenue: request.revenue,
          metadata: request.details,
        });
      }

      return { success: true };
    } catch (err) {
      // Silently fail - don't break the app if logging fails
      console.warn('[AI Action Logging] Failed to log action:', err);
      return { success: false };
    }
  },
};

