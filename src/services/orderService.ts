import { apiClient } from './apiClient';
import type { OrderStatus, PaymentStatus, OrderTimelineEvent } from '../types/index.js';

export interface BackendOrderItem {  
  id?: string;
  productId: string;
  productName: string;
  productImage?: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  color?: string;
}

export interface BackendOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  cartId?: string;
  items: BackendOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  isAiBuyerOrder: boolean;
  aiMatchScore?: number;
  timeline: OrderTimelineEvent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FrontendOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  amount: number;
  quantity: number;
  size: string;
  color: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  isAiBuyerOrder: boolean;
  aiMatchScore?: number;
  timeline: OrderTimelineEvent[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  isAiBuyerOrder?: boolean;
  aiMatchScore?: number;
}

function backendToFrontendOrder(b: BackendOrder): FrontendOrder {
  const firstItem = b.items[0] || {
    productId: '',
    productName: '',
    productImage: '',
    quantity: 1,
    unitPrice: b.totalAmount,
    size: '',
    color: '',
  };
  return {
    id: b.id,
    orderNumber: b.orderNumber,
    productId: firstItem.productId,
    productName: firstItem.productName,
    productImage: firstItem.productImage || '',
    amount: Number(b.totalAmount),
    quantity: Number(firstItem.quantity),
    size: firstItem.size || '',
    color: firstItem.color || '',
    status: b.status,
    paymentStatus: b.paymentStatus,
    createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    shippingAddress: b.shippingAddress,
    isAiBuyerOrder: b.isAiBuyerOrder,
    aiMatchScore: b.aiMatchScore,
    timeline: (b.timeline || []).map((t) => ({
      ...t,
      timestamp: typeof t.timestamp === 'string' ? new Date(t.timestamp) : new Date(t.timestamp as any),
    })),
  };
}

export const orderService = {
  async getAll(): Promise<FrontendOrder[]> {
    try {
      const result = await apiClient.get<BackendOrder[]>('/orders');
      const list = Array.isArray(result) ? result : [];
      return list.map(backendToFrontendOrder);
    } catch (err: any) {
      if (err?.statusCode === 404) return [];
      throw err;
    }
  },

  async getById(id: string): Promise<FrontendOrder | undefined> {
    try {
      const o = await apiClient.get<BackendOrder>(`/orders/${encodeURIComponent(id)}`);
      return backendToFrontendOrder(o);
    } catch (err: any) {
      if (err?.statusCode === 404) return undefined;
      throw err;
    }
  },

  async createOrder(payload: CreateOrderPayload): Promise<FrontendOrder> {
    const o = await apiClient.post<BackendOrder>('/orders', payload);
    return backendToFrontendOrder(o);
  },
};
