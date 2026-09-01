export { productService, inventoryService, aiBuyerService } from './productService';
export { cartService } from './cartService';
export { orderService } from './orderService';
export { preferencesService } from './preferencesService';
export { purchasePolicyService } from './purchasePolicyService';
export { aiSessionService } from './aiSessionService';
export { apiClient, getUserFriendlyMessage } from './apiClient';

import { products as mockProducts, aiRecommendations, aiInsights, auditEvents, merchantMetrics, analyticsData, aiBuyerActivities, getProductById as mockGetProductById, formatPrice, categoryLabels, CROSS_SELL_PRODUCT_ID, FEATURED_PRODUCT_ID, DEMO_QUERY } from '../data/mockData';
import type { Order, AIRecommendation, AIInsight, AuditEvent, AnalyticsData, MerchantMetrics, AIBuyerActivity, UserPreferences } from '../types';
import { orderService as backendOrderService } from './orderService';

let inMemoryOrders: Order[] = [];
let recommendations = [...aiRecommendations];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export { formatPrice, categoryLabels, CROSS_SELL_PRODUCT_ID, FEATURED_PRODUCT_ID, DEMO_QUERY };
export const getProductById = mockGetProductById;

export { merchantService, recommendationService, analyticsService, auditService, aiMerchantService, aiBuyerActivityService, authService, paymentService };

const paymentService = {
  async processPayment(_amount: number): Promise<{ success: boolean; transactionId: string }> {
    await delay(1500);
    return {
      success: true,
      transactionId: `rzp_test_${Date.now()}`,
    };
  },
};

const merchantService = {
  getMetrics() {
    const latest = inMemoryOrders[0];
    return {
      ...merchantMetrics,
      aiAttributedRevenue: latest?.isAiBuyerOrder ? latest.amount : merchantMetrics.aiAttributedRevenue,
      aiBuyerOrders: inMemoryOrders.length > 0 ? inMemoryOrders.filter((o) => o.isAiBuyerOrder).length : merchantMetrics.aiBuyerOrders,
      totalRevenue: merchantMetrics.totalRevenue + (latest?.amount ?? 0),
      orders: merchantMetrics.orders + inMemoryOrders.length,
    };
  },

  getRecentAiBuyerOrders(): Order[] {
    return inMemoryOrders.filter((o) => o.isAiBuyerOrder);
  },
};

const recommendationService = {
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

const analyticsService = {
  getData(): AnalyticsData {
    return analyticsData;
  },
};

const auditService = {
  getEvents(): AuditEvent[] {
    return auditEvents;
  },
};

const aiMerchantService = {
  async analyze(): Promise<{ insights: typeof aiInsights; status: string }> {
    await delay(1500);
    return {
      status: 'complete',
      insights: aiInsights,
    };
  },
};

const aiBuyerActivityService = {
  getActivities(): AIBuyerActivity[] {
    return aiBuyerActivities;
  },
};

const authService = {
  login(_email: string, _password: string): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  },
  signup(_data: { name: string; email: string; password: string }): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true });
  },
};
