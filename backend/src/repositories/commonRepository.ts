import { query } from '../config/database.js';
import type { AISession, AIAction, AuditLog, PurchasePolicy, PurchasePolicyCheck } from '../types/index.js';

function rowToAISession(row: Record<string, unknown>): AISession {
  return {
    id: row.id as string,
    userId: row.user_id as string | undefined,
    sessionType: row.session_type as AISession['sessionType'],
    initialQuery: (row.initial_query as string) || undefined,
    requirements: (row.requirements as AISession['requirements']) || undefined,
    status: (row.status as string) || 'active',
    startedAt: row.started_at ? new Date(row.started_at as string) : undefined,
    endedAt: row.ended_at ? new Date(row.ended_at as string) : undefined,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

function rowToAIAction(row: Record<string, unknown>): AIAction {
  return {
    id: row.id as string | undefined,
    aiSessionId: row.ai_session_id as string | undefined,
    userId: row.user_id as string | undefined,
    actionType: row.action_type as AIAction['actionType'],
    query: (row.query as string) || undefined,
    productId: (row.product_id as string) || undefined,
    productName: (row.product_name as string) || undefined,
    matchScore: row.match_score !== null && row.match_score !== undefined
      ? parseFloat(String(row.match_score))
      : undefined,
    revenue: row.revenue !== null && row.revenue !== undefined
      ? parseFloat(String(row.revenue))
      : undefined,
    metadata: (row.metadata as Record<string, unknown>) || undefined,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

export const aiRepository = {
  async createSession(params: {
    userId?: string;
    sessionType: AISession['sessionType'];
    initialQuery?: string;
    requirements?: AISession['requirements'];
  }): Promise<AISession> {
    const sql = `
      INSERT INTO ai_sessions (user_id, session_type, initial_query, requirements, status)
      VALUES ($1, $2, $3, $4::jsonb, 'active')
      RETURNING *
    `;
    const res = await query(sql, [
      params.userId || null,
      params.sessionType,
      params.initialQuery || null,
      params.requirements ? JSON.stringify(params.requirements) : null,
    ]);
    return rowToAISession(res.rows[0]);
  },

  async getSessionById(id: string): Promise<(AISession & { actions: AIAction[] }) | null> {
    const sql = `SELECT * FROM ai_sessions WHERE id = $1`;
    const res = await query(sql, [id]);
    if (res.rows.length === 0) return null;

    const actionsSql = `SELECT * FROM ai_actions WHERE ai_session_id = $1 ORDER BY created_at`;
    const actionsRes = await query(actionsSql, [id]);

    return {
      ...rowToAISession(res.rows[0]),
      actions: actionsRes.rows.map(rowToAIAction),
    };
  },

  async createAction(params: {
    aiSessionId: string;
    userId?: string;
    actionType: AIAction['actionType'];
    query?: string;
    productId?: string;
    productName?: string;
    matchScore?: number;
    revenue?: number;
    metadata?: Record<string, unknown>;
  }): Promise<AIAction> {
    const sql = `
      INSERT INTO ai_actions (
        ai_session_id, user_id, action_type, query,
        product_id, product_name, match_score, revenue, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
      RETURNING *
    `;
    const res = await query(sql, [
      params.aiSessionId,
      params.userId || null,
      params.actionType,
      params.query || null,
      params.productId || null,
      params.productName || null,
      params.matchScore ?? null,
      params.revenue ?? null,
      params.metadata ? JSON.stringify(params.metadata) : null,
    ]);
    return rowToAIAction(res.rows[0]);
  },
};

function rowToAuditLog(row: Record<string, unknown>): AuditLog {
  return {
    id: row.id as string | undefined,
    actor: row.actor as AuditLog['actor'],
    actorId: (row.actor_id as string) || undefined,
    event: row.event as string,
    status: row.status as AuditLog['status'],
    relatedOrderId: (row.related_order_id as string) || undefined,
    relatedOrderNumber: (row.related_order_number as string) || undefined,
    relatedProductId: (row.related_product_id as string) || undefined,
    relatedProductName: (row.related_product_name as string) || undefined,
    metadata: (row.metadata as Record<string, unknown>) || undefined,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

export const auditRepository = {
  async create(params: {
    actor: AuditLog['actor'];
    actorId?: string;
    event: string;
    status: AuditLog['status'];
    relatedOrderId?: string;
    relatedOrderNumber?: string;
    relatedProductId?: string;
    relatedProductName?: string;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog> {
    const sql = `
      INSERT INTO audit_logs (
        actor, actor_id, event, status,
        related_order_id, related_order_number,
        related_product_id, related_product_name,
        metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)
      RETURNING *
    `;
    const res = await query(sql, [
      params.actor,
      params.actorId || null,
      params.event,
      params.status,
      params.relatedOrderId || null,
      params.relatedOrderNumber || null,
      params.relatedProductId || null,
      params.relatedProductName || null,
      params.metadata ? JSON.stringify(params.metadata) : null,
    ]);
    return rowToAuditLog(res.rows[0]);
  },
};

function rowToPurchasePolicy(row: Record<string, unknown>): PurchasePolicy {
  const rawChecks = (row.checks as unknown[]) || [];
  const checks: PurchasePolicyCheck[] = rawChecks.map((c) => {
    const check = c as Record<string, unknown>;
    return {
      id: (check.id as string) || '',
      name: (check.name as string) || '',
      label: (check.label as string) || '',
      passed: !!check.passed,
      details: (check.details as string) || undefined,
    };
  });

  return {
    id: row.id as string | undefined,
    status: row.status as PurchasePolicy['status'],
    checks,
    orderId: (row.order_id as string) || undefined,
    cartId: (row.cart_id as string) || undefined,
    userId: (row.user_id as string) || undefined,
    evaluatedBy: (row.evaluated_by as string) || undefined,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

export const policyRepository = {
  async create(params: {
    orderId?: string;
    cartId?: string;
    userId?: string;
    status: PurchasePolicy['status'];
    checks: PurchasePolicyCheck[];
    evaluatedBy?: string;
  }): Promise<PurchasePolicy> {
    const sql = `
      INSERT INTO purchase_policies (
        order_id, cart_id, user_id, status, checks, evaluated_by
      ) VALUES ($1, $2, $3, $4, $5::jsonb, $6)
      RETURNING *
    `;
    const res = await query(sql, [
      params.orderId || null,
      params.cartId || null,
      params.userId || null,
      params.status,
      JSON.stringify(params.checks),
      params.evaluatedBy || 'system',
    ]);
    return rowToPurchasePolicy(res.rows[0]);
  },

  async getLatestForUser(userId: string): Promise<PurchasePolicy | null> {
    const sql = `
      SELECT * FROM purchase_policies
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const res = await query(sql, [userId]);
    if (res.rows.length === 0) return null;
    return rowToPurchasePolicy(res.rows[0]);
  },
};

export interface Payment {
  id?: string;
  orderId: string;
  amount: number;
  method: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  transactionId?: string;
  rawResponse?: Record<string, unknown>;
  createdAt?: Date;
}

function rowToPayment(row: Record<string, unknown>): Payment {
  return {
    id: row.id as string | undefined,
    orderId: row.order_id as string,
    amount: parseFloat(String(row.amount)),
    method: row.method as string,
    status: row.status as Payment['status'],
    transactionId: (row.transaction_id as string) || undefined,
    rawResponse: (row.raw_response as Record<string, unknown>) || undefined,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
  };
}

export const paymentRepository = {
  async create(params: {
    orderId: string;
    amount: number;
    method: string;
    status: Payment['status'];
    transactionId?: string;
    rawResponse?: Record<string, unknown>;
  }): Promise<Payment> {
    const sql = `
      INSERT INTO payments (order_id, amount, method, status, transaction_id, raw_response)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb)
      RETURNING *
    `;
    const res = await query(sql, [
      params.orderId,
      params.amount,
      params.method,
      params.status,
      params.transactionId || null,
      params.rawResponse ? JSON.stringify(params.rawResponse) : null,
    ]);
    return rowToPayment(res.rows[0]);
  },

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const sql = `
      SELECT * FROM payments
      WHERE order_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const res = await query(sql, [orderId]);
    if (res.rows.length === 0) return null;
    return rowToPayment(res.rows[0]);
  },

  async updateStatus(
    paymentId: string,
    status: Payment['status'],
    transactionId?: string,
    rawResponse?: Record<string, unknown>,
  ): Promise<Payment | null> {
    const sql = `
      UPDATE payments
        SET status = $2,
          transaction_id = COALESCE($3, transaction_id),
          raw_response = COALESCE($4::jsonb, raw_response)
      WHERE id = $1
      RETURNING *
    `;
    const res = await query(sql, [
      paymentId,
      status,
      transactionId || null,
      rawResponse ? JSON.stringify(rawResponse) : null,
    ]);
    if (res.rows.length === 0) return null;
    return rowToPayment(res.rows[0]);
  },

  async updateRazorpayOrderId(orderId: string, razorpayOrderId: string): Promise<void> {
    await query(`
      UPDATE payments
      SET raw_response = COALESCE(raw_response, '{}'::jsonb) || $2::jsonb
      WHERE order_id = $1
    `, [orderId, JSON.stringify({ razorpayOrderId })]);
  },
};
