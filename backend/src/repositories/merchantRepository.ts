import { query } from '../config/database.js';
import type { AIAction, AIInsight, AIRecommendation, AuditLog, RecommendationStatus, RecommendationType } from '../types/index.js';

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

export interface MerchantOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string;
  paymentStatus: string;
  isAiBuyerOrder: boolean;
  createdAt: Date;
  productName?: string;
}

function number(value: unknown): number {
  return Number(value || 0);
}

function mapInsight(row: Record<string, unknown>): AIInsight & { metadata?: Record<string, unknown> } {
  return {
    id: row.id as string,
    type: row.type as AIInsight['type'],
    title: row.title as string,
    description: row.description as string,
    impact: (row.impact as string) || '',
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

function mapRecommendation(row: Record<string, unknown>): AIRecommendation & { description: string; metadata?: Record<string, unknown> } {
  return {
    id: row.id as string,
    type: row.type as RecommendationType,
    title: row.title as string,
    description: row.description as string,
    productIds: (row.product_ids as string[]) || [],
    expectedImpact: (row.expected_impact as string) || '',
    revenueImpact: number(row.revenue_impact),
    status: row.status as RecommendationStatus,
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

function mapAction(row: Record<string, unknown>): AIAction {
  return {
    id: row.id as string,
    aiSessionId: row.ai_session_id as string | undefined,
    actionType: row.action_type as AIAction['actionType'],
    query: row.query as string | undefined,
    productId: row.product_id as string | undefined,
    productName: row.product_name as string | undefined,
    matchScore: row.match_score === null ? undefined : number(row.match_score),
    revenue: row.revenue === null ? undefined : number(row.revenue),
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

function mapAudit(row: Record<string, unknown>): AuditLog {
  return {
    id: row.id as string,
    actor: row.actor as AuditLog['actor'],
    actorId: row.actor_id as string | undefined,
    event: row.event as string,
    status: row.status as AuditLog['status'],
    relatedOrderId: row.related_order_id as string | undefined,
    relatedOrderNumber: row.related_order_number as string | undefined,
    relatedProductId: row.related_product_id as string | undefined,
    relatedProductName: row.related_product_name as string | undefined,
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

export const merchantRepository = {
  async getMerchantId(): Promise<string | null> {
    const result = await query(`SELECT id FROM merchants WHERE email = $1 LIMIT 1`, ['merchant@agentcart.ai']);
    return result.rows[0]?.id as string | undefined || null;
  },

  async getMetrics(): Promise<MerchantMetrics> {
    const result = await query(`
      SELECT
        COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'success'), 0) AS total_revenue,
        COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'success' AND is_ai_buyer_order), 0) AS ai_revenue,
        COUNT(*) FILTER (WHERE payment_status = 'success') AS orders,
        COUNT(*) FILTER (WHERE payment_status = 'success' AND is_ai_buyer_order) AS ai_orders
      FROM orders
    `);
    const row = result.rows[0];
    const totalRevenue = number(row.total_revenue);
    const orders = number(row.orders);
    const aiRevenue = number(row.ai_revenue);
    const aiOrders = number(row.ai_orders);
    const sessionResult = await query(`SELECT COUNT(*) AS sessions FROM ai_sessions WHERE session_type = 'buyer'`);
    const sessions = number(sessionResult.rows[0]?.sessions);
    return {
      totalRevenue,
      aiAttributedRevenue: aiRevenue,
      orders,
      aiBuyerOrders: aiOrders,
      averageOrderValue: orders ? totalRevenue / orders : 0,
      aiBuyerConversionRate: sessions ? (aiOrders / sessions) * 100 : 0,
      aiRevenueShare: totalRevenue ? (aiRevenue / totalRevenue) * 100 : 0,
    };
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const [trend, products, sessions, metrics] = await Promise.all([
      query(`
        SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date,
          COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'success'), 0) AS revenue,
          COALESCE(SUM(total_amount) FILTER (WHERE payment_status = 'success' AND is_ai_buyer_order), 0) AS ai_revenue,
          COUNT(*) FILTER (WHERE payment_status = 'success') AS orders,
          COUNT(*) FILTER (WHERE payment_status = 'success' AND is_ai_buyer_order) AS ai_orders
        FROM orders GROUP BY DATE(created_at) ORDER BY DATE(created_at)
      `),
      query(`
        SELECT oi.product_id, oi.product_name AS name,
          COALESCE(SUM(oi.unit_price * oi.quantity) FILTER (WHERE o.payment_status = 'success'), 0) AS revenue,
          COUNT(DISTINCT o.id) FILTER (WHERE o.payment_status = 'success') AS orders,
          COUNT(DISTINCT o.id) FILTER (WHERE o.payment_status = 'success' AND o.is_ai_buyer_order) AS ai_orders,
          (SELECT COUNT(*) FROM ai_actions a WHERE a.product_id = oi.product_id AND a.action_type IN ('search', 'view', 'compare', 'cart')) AS ai_interest
        FROM order_items oi JOIN orders o ON o.id = oi.order_id
        GROUP BY oi.product_id, oi.product_name ORDER BY revenue DESC
      `),
      query(`SELECT COUNT(*) FILTER (WHERE session_type = 'buyer') AS sessions, COUNT(*) FILTER (WHERE session_type = 'buyer' AND status = 'completed') AS completed FROM ai_sessions`),
      this.getMetrics(),
    ]);
    return {
      metrics,
      revenueTrend: trend.rows.map((row) => ({ date: row.date as string, revenue: number(row.revenue), aiRevenue: number(row.ai_revenue) })),
      ordersTrend: trend.rows.map((row) => ({ date: row.date as string, orders: number(row.orders), aiOrders: number(row.ai_orders) })),
      productPerformance: products.rows.map((row) => ({ productId: row.product_id as string, name: row.name as string, revenue: number(row.revenue), orders: number(row.orders), aiOrders: number(row.ai_orders), aiInterest: number(row.ai_interest) })),
      conversionMetrics: { aiBuyerSessions: number(sessions.rows[0]?.sessions), aiBuyerPurchases: metrics.aiBuyerOrders, aiConversionRate: metrics.aiBuyerConversionRate },
    };
  },

  async getInsights(merchantId: string): Promise<(AIInsight & { metadata?: Record<string, unknown> })[]> {
    const result = await query(`SELECT * FROM ai_insights WHERE merchant_id = $1 ORDER BY created_at DESC`, [merchantId]);
    return result.rows.map(mapInsight);
  },

  async getRecommendations(merchantId: string): Promise<(AIRecommendation & { description: string; metadata?: Record<string, unknown> })[]> {
    const result = await query(`SELECT * FROM recommendations WHERE merchant_id = $1 ORDER BY created_at DESC`, [merchantId]);
    return result.rows.map(mapRecommendation);
  },

  async getActivity(): Promise<AIAction[]> {
    const result = await query(`
      SELECT a.* FROM ai_actions a JOIN ai_sessions s ON s.id = a.ai_session_id
      WHERE s.session_type = 'buyer' ORDER BY a.created_at DESC LIMIT 200
    `);
    return result.rows.map(mapAction);
  },

  async getOrders(): Promise<MerchantOrder[]> {
    const result = await query(`
      SELECT o.id, o.order_number, o.customer_name, o.total_amount, o.status,
        o.payment_status, o.is_ai_buyer_order, o.created_at,
        (SELECT product_name FROM order_items WHERE order_id = o.id ORDER BY created_at LIMIT 1) AS product_name
      FROM orders o ORDER BY o.created_at DESC LIMIT 200
    `);
    return result.rows.map((row) => ({
      id: row.id as string,
      orderNumber: row.order_number as string,
      customerName: row.customer_name as string,
      amount: number(row.total_amount),
      status: row.status as string,
      paymentStatus: row.payment_status as string,
      isAiBuyerOrder: !!row.is_ai_buyer_order,
      createdAt: new Date(row.created_at as string),
      productName: row.product_name as string | undefined,
    }));
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const result = await query(`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200`);
    return result.rows.map(mapAudit);
  },

  async setRecommendationStatus(id: string, status: RecommendationStatus): Promise<(AIRecommendation & { description: string }) | null> {
    const result = await query(`UPDATE recommendations SET status = $2 WHERE id = $1 RETURNING *`, [id, status]);
    return result.rows[0] ? mapRecommendation(result.rows[0]) : null;
  },

  async createInsight(merchantId: string, insight: { type: string; title: string; description: string; impact: string; metadata: Record<string, unknown> }): Promise<AIInsight> {
    const result = await query(`
      INSERT INTO ai_insights (merchant_id, type, title, description, impact, metadata)
      VALUES ($1, $2::insight_type, $3, $4, $5, $6::jsonb) RETURNING *
    `, [merchantId, insight.type, insight.title, insight.description, insight.impact, JSON.stringify(insight.metadata)]);
    return mapInsight(result.rows[0]);
  },

  async createRecommendation(merchantId: string, insightId: string, recommendation: { type: string; title: string; description: string; productIds: string[]; expectedImpact: string; revenueImpact: number }): Promise<AIRecommendation> {
    const result = await query(`
      INSERT INTO recommendations (merchant_id, ai_insight_id, type, title, description, product_ids, expected_impact, revenue_impact)
      VALUES ($1, $2, $3::recommendation_type, $4, $5, $6, $7, $8) RETURNING *
    `, [merchantId, insightId, recommendation.type, recommendation.title, recommendation.description, recommendation.productIds, recommendation.expectedImpact, recommendation.revenueImpact]);
    return mapRecommendation(result.rows[0]);
  },

  async findOpportunity(merchantId: string, productIds: string[]): Promise<{ insight: AIInsight; recommendation: AIRecommendation } | null> {
    const result = await query(`
      SELECT i.*, r.id AS recommendation_id, r.type AS recommendation_type,
        r.title AS recommendation_title, r.description AS recommendation_description,
        r.product_ids AS recommendation_product_ids, r.expected_impact,
        r.revenue_impact, r.status AS recommendation_status, r.created_at AS recommendation_created_at
      FROM ai_insights i
      JOIN recommendations r ON r.ai_insight_id = i.id
      WHERE i.merchant_id = $1 AND i.type = 'cross-sell' AND r.product_ids = $2::varchar[]
      ORDER BY i.created_at DESC LIMIT 1
    `, [merchantId, productIds]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      insight: mapInsight(row),
      recommendation: mapRecommendation({
        id: row.recommendation_id,
        type: row.recommendation_type,
        title: row.recommendation_title,
        description: row.recommendation_description,
        product_ids: row.recommendation_product_ids,
        expected_impact: row.expected_impact,
        revenue_impact: row.revenue_impact,
        status: row.recommendation_status,
        created_at: row.recommendation_created_at,
      }),
    };
  },

  async getCoPurchases(): Promise<{ productA: string; productB: string; nameA: string; nameB: string; count: number }[]> {
    const result = await query(`
      SELECT a.product_id AS product_a, b.product_id AS product_b,
        a.product_name AS name_a, b.product_name AS name_b, COUNT(DISTINCT a.order_id) AS count
      FROM order_items a JOIN order_items b ON a.order_id = b.order_id AND a.product_id < b.product_id
      JOIN orders o ON o.id = a.order_id AND o.payment_status = 'success'
      GROUP BY a.product_id, b.product_id, a.product_name, b.product_name
      HAVING COUNT(DISTINCT a.order_id) >= 2 ORDER BY count DESC
    `);
    return result.rows.map((row) => ({ productA: row.product_a as string, productB: row.product_b as string, nameA: row.name_a as string, nameB: row.name_b as string, count: number(row.count) }));
  },
};
