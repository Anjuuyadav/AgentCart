import { query, getClient } from '../config/database.js';
import type { Order, OrderItem, OrderTimelineEvent } from '../types/index.js';

function rowToOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id: row.id as string | undefined,
    productId: row.product_id as string,
    variantId: row.variant_id as string | undefined,
    quantity: parseInt(String(row.quantity || 0), 10),
    unitPrice: parseFloat(String(row.unit_price)),
    productName: row.product_name as string,
    productImage: (row.product_image as string) || undefined,
    size: row.size as string | undefined,
    color: row.color as string | undefined,
  };
}

function rowToOrder(row: Record<string, unknown>, items: OrderItem[]): Order {
  const timeline = (row.timeline as unknown[] || []).map((evt) => {
    const e = evt as Record<string, unknown>;
    return {
      id: e.id as string,
      label: e.label as string,
      timestamp: new Date(e.timestamp as string),
      status: e.status as OrderTimelineEvent['status'],
    };
  });

  return {
    id: row.id as string | undefined,
    orderNumber: row.order_number as string,
    userId: row.user_id as string | undefined,
    cartId: row.cart_id as string | undefined,
    items,
    totalAmount: parseFloat(String(row.total_amount)),
    status: row.status as Order['status'],
    paymentStatus: row.payment_status as Order['paymentStatus'],
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    shippingAddress: row.shipping_address as string,
    isAiBuyerOrder: !!row.is_ai_buyer_order,
    aiMatchScore: row.ai_match_score !== null && row.ai_match_score !== undefined
      ? parseFloat(String(row.ai_match_score))
      : undefined,
    timeline,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at as string) : undefined,
  };
}

export const orderRepository = {
  async findByUser(userId: string): Promise<Order[]> {
    const orderSql = `
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const orderRes = await query(orderSql, [userId]);

    const orders: Order[] = [];
    for (const row of orderRes.rows) {
      const items = await this.findItemsByOrderId(row.id as string);
      orders.push(rowToOrder(row, items));
    }
    return orders;
  },

  async findById(id: string): Promise<Order | null> {
    const sql = `SELECT * FROM orders WHERE id = $1`;
    const res = await query(sql, [id]);
    if (res.rows.length === 0) return null;
    const items = await this.findItemsByOrderId(id);
    return rowToOrder(res.rows[0], items);
  },

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const sql = `SELECT * FROM orders WHERE order_number = $1`;
    const res = await query(sql, [orderNumber]);
    if (res.rows.length === 0) return null;
    const items = await this.findItemsByOrderId(res.rows[0].id as string);
    return rowToOrder(res.rows[0], items);
  },

  async findItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const sql = `SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at`;
    const res = await query(sql, [orderId]);
    return res.rows.map(rowToOrderItem);
  },

  async getNextOrderNumber(): Promise<string> {
    const sql = `
      SELECT COALESCE(
        (SELECT MAX(CAST(SUBSTRING(order_number, 4) AS INTEGER)) FROM orders),
        10428
      ) + 1 AS next_num
    `;
    const res = await query(sql);
    const num = parseInt(String(res.rows[0].next_num), 10);
    return `AC-${num}`;
  },

  async create(params: {
    orderNumber: string;
    userId: string | undefined;
    cartId: string | undefined;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    isAiBuyerOrder: boolean;
    aiMatchScore?: number;
    timelineJson: unknown[];
    items: Omit<OrderItem, 'id'>[];
  }): Promise<Order> {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const orderSql = `
        INSERT INTO orders (
          order_number, user_id, cart_id, total_amount, status, payment_status,
          customer_name, customer_email, shipping_address, is_ai_buyer_order,
          ai_match_score, timeline
        ) VALUES (
          $1, $2, $3, $4, 'confirmed', 'success',
          $5, $6, $7, $8, $9, $10::jsonb
        ) RETURNING *
      `;
      const orderRes = await client.query(orderSql, [
        params.orderNumber,
        params.userId || null,
        params.cartId || null,
        params.totalAmount,
        params.customerName,
        params.customerEmail,
        params.shippingAddress,
        params.isAiBuyerOrder,
        params.aiMatchScore ?? null,
        JSON.stringify(params.timelineJson),
      ]);
      const orderRow = orderRes.rows[0];

      for (const item of params.items) {
        const itemSql = `
          INSERT INTO order_items (
            order_id, product_id, variant_id, quantity, unit_price,
            product_name, product_image, size, color
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        await client.query(itemSql, [
          orderRow.id,
          item.productId,
          item.variantId || null,
          item.quantity,
          item.unitPrice,
          item.productName,
          item.productImage || null,
          item.size || null,
          item.color || null,
        ]);
      }

      const paymentSql = `
        INSERT INTO payments (order_id, amount, method, status, transaction_id)
        VALUES ($1, $2, 'razorpay', 'success', $3)
      `;
      await client.query(paymentSql, [
        orderRow.id,
        params.totalAmount,
        `rzp_test_${Date.now()}`,
      ]);

      await client.query('COMMIT');

      const items = await this.findItemsByOrderId(orderRow.id as string);
      return rowToOrder(orderRow, items);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },
};
