export { productService } from './productService';
export { aiBuyerService } from './productService';

import { aiRecommendations, aiInsights, auditEvents, merchantMetrics, analyticsData, aiBuyerActivities } from '../data/mockData';
import type { Order, AIRecommendation } from '../types';
import { getProductById } from '../data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let orders: Order[] = [];
let recommendations = [...aiRecommendations];

export const orderService = {
  getAll(): Order[] {
    return orders;
  },

  getById(id: string): Order | undefined {
    return orders.find((o) => o.id === id || o.orderNumber === id);
  },

  async createOrder(data: {
    productId: string;
    quantity: number;
    size: string;
    color: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    isAiBuyerOrder?: boolean;
    aiMatchScore?: number;
  }): Promise<Order> {
    await delay(1500);
    const product = getProductById(data.productId);
    if (!product) throw new Error('Product not found');

    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `AC-${10429 + orders.length}`,
      productId: data.productId,
      productName: product.name,
      productImage: product.image,
      amount: product.price * data.quantity,
      quantity: data.quantity,
      size: data.size,
      color: data.color,
      status: 'confirmed',
      paymentStatus: 'success',
      createdAt: new Date(),
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      shippingAddress: data.shippingAddress,
      isAiBuyerOrder: data.isAiBuyerOrder ?? false,
      aiMatchScore: data.aiMatchScore,
      timeline: [
        { id: 't1', label: 'Order Placed', timestamp: new Date(), status: 'completed' },
        { id: 't2', label: 'Payment Confirmed', timestamp: new Date(), status: 'completed' },
        { id: 't3', label: 'Processing', timestamp: new Date(), status: 'current' },
        { id: 't4', label: 'Shipped', timestamp: new Date(), status: 'pending' },
        { id: 't5', label: 'Delivered', timestamp: new Date(), status: 'pending' },
      ],
    };

    orders = [order, ...orders];
    return order;
  },

  getLatestOrder(): Order | undefined {
    return orders[0];
  },

  hasOrders(): boolean {
    return orders.length > 0;
  },
};

export const paymentService = {
  async processPayment(_amount: number): Promise<{ success: boolean; transactionId: string }> {
    await delay(2000);
    return {
      success: true,
      transactionId: `rzp_test_${Date.now()}`,
    };
  },
};

export const merchantService = {
  getMetrics() {
    const latestOrder = orderService.getLatestOrder();
    return {
      ...merchantMetrics,
      aiAttributedRevenue: latestOrder?.isAiBuyerOrder ? latestOrder.amount : merchantMetrics.aiAttributedRevenue,
      aiBuyerOrders: orderService.hasOrders() ? orders.filter((o) => o.isAiBuyerOrder).length : merchantMetrics.aiBuyerOrders,
      totalRevenue: merchantMetrics.totalRevenue + (latestOrder?.amount ?? 0),
      orders: merchantMetrics.orders + orders.length,
    };
  },

  getRecentAiBuyerOrders(): Order[] {
    return orders.filter((o) => o.isAiBuyerOrder);
  },
};

export const recommendationService = {
  getAll(): AIRecommendation[] {
    return recommendations;
  },

  approve(id: string): AIRecommendation | undefined {
    const rec = recommendations.find((r) => r.id === id);
    if (rec) rec.status = 'approved';
    return rec;
  },

  reject(id: string): AIRecommendation | undefined {
    const rec = recommendations.find((r) => r.id === id);
    if (rec) rec.status = 'rejected';
    return rec;
  },
};

export const analyticsService = {
  getData() {
    return analyticsData;
  },
};

export const auditService = {
  getEvents() {
    return auditEvents;
  },
};

export const aiMerchantService = {
  async analyze(): Promise<{ insights: typeof aiInsights; status: string }> {
    await delay(1500);
    return {
      status: 'complete',
      insights: aiInsights,
    };
  },
};

export const aiBuyerActivityService = {
  getActivities() {
    return aiBuyerActivities;
  },
};

export const authService = {
  login(_email: string, _password: string): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  },
  signup(_data: { name: string; email: string; password: string }): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  },
};
