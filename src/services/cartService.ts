import { apiClient } from './apiClient';
import type { CartItem } from '../types';
import type { AddCartItemPayload, UpdateCartItemPayload } from './apiTypes';

export interface BackendCartItem extends CartItem {
  id: string;
  variantId?: string;
  unitPrice?: number;
  productName?: string;
  productImage?: string;
  productPrice?: number;
}

export interface BackendCart {
  id?: string;
  userId?: string;
  sessionId?: string;
  status?: 'active' | 'checked_out' | 'abandoned';
  items: BackendCartItem[];
  subtotal: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

function emptyCart(): BackendCart {
  return {
    items: [],
    subtotal: 0,
    total: 0,
  };
}

export const cartService = {
  async getCart(): Promise<BackendCart> {
    try {
      const cart = await apiClient.get<BackendCart>('/cart');
      return cart || emptyCart();
    } catch (err: any) {
      if (err?.statusCode === 404) return emptyCart();
      throw err;
    }
  },

  async addItem(payload: AddCartItemPayload): Promise<BackendCart> {
    return apiClient.post<BackendCart>('/cart/items', payload);
  },

  async updateItem(itemId: string, payload: UpdateCartItemPayload): Promise<BackendCart> {
    return apiClient.patch<BackendCart>(`/cart/items/${encodeURIComponent(itemId)}`, payload);
  },

  async removeItem(itemId: string): Promise<BackendCart> {
    return apiClient.delete<BackendCart>(`/cart/items/${encodeURIComponent(itemId)}`);
  },

  async clearCart(): Promise<BackendCart> {
    return apiClient.delete<BackendCart>('/cart');
  },
};
