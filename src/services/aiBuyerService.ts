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
};
