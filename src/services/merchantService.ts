import { apiClient } from './apiClient';

export interface MerchantMetrics {
  totalRevenue: number;
  aiAttributedRevenue: number;
  orders: number;
  aiBuyerOrders: number;
  averageOrderValue: number;
  aiBuyerConversionRate: number;
  aiRevenueShare: number;
}

export interface AnalyticsData {
  revenueTrend: { date: string; revenue: number; aiRevenue: number }[];
  ordersTrend: { date: string; orders: number; aiOrders: number }[];
  productPerformance: { productId: string; name: string; revenue: number; orders: number; aiOrders: number; aiInterest: number }[];
  conversionMetrics: { aiBuyerSessions: number; aiBuyerPurchases: number; aiConversionRate: number };
  metrics: MerchantMetrics;
}

export interface MerchantInsight { id: string; type: string; title: string; description: string; impact: string; metadata?: Record<string, unknown>; createdAt?: string; }
export interface MerchantRecommendation { id: string; type: string; title: string; description: string; productIds: string[]; expectedImpact: string; revenueImpact: number; status: 'pending' | 'approved' | 'rejected'; createdAt?: string; }
export interface BuyerActivity { id: string; aiSessionId?: string; actionType: string; query?: string; productId?: string; productName?: string; matchScore?: number; revenue?: number; metadata?: Record<string, unknown>; createdAt?: string; }
export interface MerchantAudit { id: string; actor: string; event: string; status: string; relatedOrderNumber?: string; relatedProductName?: string; metadata?: Record<string, unknown>; createdAt?: string; }
export interface MerchantOrder { id: string; orderNumber: string; customerName: string; amount: number; status: string; paymentStatus: string; isAiBuyerOrder: boolean; createdAt: string; productName?: string; }

export const merchantService = {
  getMetrics: () => apiClient.get<MerchantMetrics>('/merchant/metrics'),
  getAnalytics: () => apiClient.get<AnalyticsData>('/merchant/analytics'),
  getInsights: () => apiClient.get<MerchantInsight[]>('/merchant/insights'),
  getRecommendations: () => apiClient.get<MerchantRecommendation[]>('/merchant/recommendations'),
  updateRecommendation: (id: string, status: 'approved' | 'rejected') => apiClient.patch<MerchantRecommendation>(`/merchant/recommendations/${id}`, { status }),
  getBuyerActivity: () => apiClient.get<BuyerActivity[]>('/merchant/ai-buyers/activity'),
  getOrders: () => apiClient.get<MerchantOrder[]>('/merchant/orders'),
  getAudit: () => apiClient.get<MerchantAudit[]>('/merchant/audit'),
  analyze: () => apiClient.post<{ status: string; message: string; insights: MerchantInsight[]; recommendations: MerchantRecommendation[] }>('/merchant/ai/analyze', {}),
};
