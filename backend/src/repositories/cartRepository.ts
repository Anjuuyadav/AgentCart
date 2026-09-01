import { query, getClient } from '../config/database.js';
import type { Cart, CartItem } from '../types/index.js';

function rowToCartItem(row: Record<string, unknown>): CartItem {
  return {
    id: row.id as string | undefined,
    productId: row.product_id as string,
    variantId: row.variant_id as string | undefined,
    quantity: parseInt(String(row.quantity || 0), 10),
    unitPrice: row.unit_price !== null && row.unit_price !== undefined
      ? parseFloat(String(row.unit_price))
      : undefined,
    size: row.size as string,
    color: row.color as string,
    productName: row.product_name as string | undefined,
    productImage: row.product_image as string | undefined,
    productPrice: row.product_price !== null && row.product_price !== undefined
      ? parseFloat(String(row.product_price))
      : undefined,
  };
}

function rowToCart(row: Record<string, unknown>, items: CartItem[]): Cart {
  return {
    id: row.id as string | undefined,
    userId: row.user_id as string | undefined,
    sessionId: row.session_id as string | undefined,
    status: row.status as Cart['status'],
    items,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at as string) : undefined,
  };
}

export const cartRepository = {
  async findActiveByUserOrSession(userId: string, sessionId: string): Promise<Cart | null> {
    const cartSql = `
      SELECT * FROM carts
      WHERE (user_id = $1 OR session_id = $2) AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const cartRes = await query(cartSql, [userId, sessionId]);
    if (cartRes.rows.length === 0) return null;

    const cartRow = cartRes.rows[0];
    const itemsSql = `
      SELECT
        ci.id,
        ci.cart_id,
        ci.product_id,
        ci.variant_id,
        ci.quantity,
        ci.unit_price,
        ci.size,
        ci.color,
        p.name AS product_name,
        p.image AS product_image,
        p.price AS product_price
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at
    `;
    const itemsRes = await query(itemsSql, [cartRow.id]);
    const items = itemsRes.rows.map(rowToCartItem);

    return rowToCart(cartRow, items);
  },

  async create(userId: string | undefined, sessionId: string): Promise<Cart> {
    const sql = `
      INSERT INTO carts (user_id, session_id, status)
      VALUES ($1, $2, 'active')
      RETURNING *
    `;
    const res = await query(sql, [userId || null, sessionId]);
    return rowToCart(res.rows[0], []);
  },

  async findCartItemByProductVariant(
    cartId: string,
    productId: string,
    size: string,
    color: string,
  ): Promise<CartItem | null> {
    const sql = `
      SELECT * FROM cart_items
      WHERE cart_id = $1 AND product_id = $2 AND size = $3 AND color = $4
      LIMIT 1
    `;
    const res = await query(sql, [cartId, productId, size, color]);
    if (res.rows.length === 0) return null;
    return rowToCartItem(res.rows[0]);
  },

  async addItem(
    cartId: string,
    item: Omit<CartItem, 'id'> & { unitPrice: number },
  ): Promise<CartItem> {
    const sql = `
      INSERT INTO cart_items
        (cart_id, product_id, variant_id, quantity, unit_price, size, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const res = await query(sql, [
      cartId,
      item.productId,
      item.variantId || null,
      item.quantity,
      item.unitPrice,
      item.size,
      item.color,
    ]);
    return rowToCartItem(res.rows[0]);
  },

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem | null> {
    const sql = `
      UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *
    `;
    const res = await query(sql, [quantity, cartItemId]);
    if (res.rows.length === 0) return null;
    return rowToCartItem(res.rows[0]);
  },

  async removeItem(cartItemId: string): Promise<boolean> {
    const sql = `DELETE FROM cart_items WHERE id = $1`;
    const res = await query(sql, [cartItemId]);
    return (res.rowCount || 0) > 0;
  },

  async findItemById(cartItemId: string): Promise<CartItem | null> {
    const sql = `SELECT * FROM cart_items WHERE id = $1`;
    const res = await query(sql, [cartItemId]);
    if (res.rows.length === 0) return null;
    return rowToCartItem(res.rows[0]);
  },

  async clearCart(cartId: string): Promise<number> {
    const sql = `DELETE FROM cart_items WHERE cart_id = $1`;
    const res = await query(sql, [cartId]);
    return res.rowCount || 0;
  },

  async markCheckedOut(cartId: string): Promise<void> {
    const sql = `UPDATE carts SET status = 'checked_out' WHERE id = $1`;
    await query(sql, [cartId]);
  },

  async findByIdWithItems(cartId: string): Promise<Cart | null> {
    const cartSql = `SELECT * FROM carts WHERE id = $1`;
    const cartRes = await query(cartSql, [cartId]);
    if (cartRes.rows.length === 0) return null;

    const itemsSql = `
      SELECT
        ci.*,
        p.name AS product_name,
        p.image AS product_image,
        p.price AS product_price
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at
    `;
    const itemsRes = await query(itemsSql, [cartId]);
    const items = itemsRes.rows.map(rowToCartItem);

    return rowToCart(cartRes.rows[0], items);
  },
};
