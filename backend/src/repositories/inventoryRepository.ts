import { query } from '../config/database.js';
import type { InventoryItem } from '../types/index.js';

function rowToInventory(row: Record<string, unknown>): InventoryItem {
  const stock = parseInt(String(row.stock || 0), 10);
  const reserved = parseInt(String(row.reserved || 0), 10);
  return {
    id: row.id as string | undefined,
    variantId: row.variant_id as string,
    productId: row.product_id as string,
    stock,
    reserved,
    available: Math.max(0, stock - reserved),
    size: row.size as string | undefined,
    color: row.color as string | undefined,
    sku: row.sku as string | undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at as string) : undefined,
  };
}

export const inventoryRepository = {
  async findAll(): Promise<InventoryItem[]> {
    const sql = `
      SELECT
        i.id,
        i.variant_id,
        i.product_id,
        i.stock,
        i.reserved,
        i.updated_at,
        v.size,
        v.color,
        v.sku
      FROM inventory i
      JOIN product_variants v ON v.id = i.variant_id
      ORDER BY i.product_id, v.size, v.color
    `;
    const res = await query(sql);
    return res.rows.map(rowToInventory);
  },

  async findByProductId(productId: string): Promise<InventoryItem[]> {
    const sql = `
      SELECT
        i.id,
        i.variant_id,
        i.product_id,
        i.stock,
        i.reserved,
        i.updated_at,
        v.size,
        v.color,
        v.sku
      FROM inventory i
      JOIN product_variants v ON v.id = i.variant_id
      WHERE i.product_id = $1
      ORDER BY v.size, v.color
    `;
    const res = await query(sql, [productId]);
    return res.rows.map(rowToInventory);
  },

  async getAvailability(
    productId: string,
    size: string,
    color: string,
  ): Promise<{ variantId: string | null; available: number; stock: number; reserved: number; unitPrice: number | null }> {
    const sql = `
      SELECT
        v.id AS variant_id,
        COALESCE(i.stock, 0) AS stock,
        COALESCE(i.reserved, 0) AS reserved,
        COALESCE(v.price_override, p.price) AS unit_price
      FROM product_variants v
      LEFT JOIN inventory i ON i.variant_id = v.id
      JOIN products p ON p.id = v.product_id
      WHERE v.product_id = $1 AND v.size = $2 AND v.color = $3
      LIMIT 1
    `;
    const res = await query(sql, [productId, size, color]);
    if (res.rows.length === 0) {
      return { variantId: null, available: 0, stock: 0, reserved: 0, unitPrice: null };
    }
    const row = res.rows[0];
    const stock = parseInt(String(row.stock || 0), 10);
    const reserved = parseInt(String(row.reserved || 0), 10);
    return {
      variantId: row.variant_id as string | null,
      available: Math.max(0, stock - reserved),
      stock,
      reserved,
      unitPrice: row.unit_price !== null && row.unit_price !== undefined
        ? parseFloat(String(row.unit_price))
        : null,
    };
  },

  async getVariantById(variantId: string): Promise<InventoryItem | null> {
    const sql = `
      SELECT
        i.id,
        i.variant_id,
        i.product_id,
        i.stock,
        i.reserved,
        i.updated_at,
        v.size,
        v.color,
        v.sku
      FROM inventory i
      JOIN product_variants v ON v.id = i.variant_id
      WHERE i.variant_id = $1
      LIMIT 1
    `;
    const res = await query(sql, [variantId]);
    if (res.rows.length === 0) return null;
    return rowToInventory(res.rows[0]);
  },

  /**
   * Deduct inventory when an order is placed
   * Uses row-level locking for safety
   */
  async deductStock(variantId: string, quantity: number): Promise<boolean> {
    const sql = `
      UPDATE inventory
      SET stock = stock - $2
      WHERE variant_id = $1 AND stock >= $2
      RETURNING *
    `;
    const res = await query(sql, [variantId, quantity]);
    return res.rows.length > 0;
  },

  /**
   * Reserve inventory (temporary hold)
   */
  async reserveStock(variantId: string, quantity: number): Promise<boolean> {
    const sql = `
      UPDATE inventory
      SET reserved = reserved + $2
      WHERE variant_id = $1 AND (stock - reserved) >= $2
      RETURNING *
    `;
    const res = await query(sql, [variantId, quantity]);
    return res.rows.length > 0;
  },

  /**
   * Release reserved inventory
   */
  async releaseReserved(variantId: string, quantity: number): Promise<boolean> {
    const sql = `
      UPDATE inventory
      SET reserved = MAX(0, reserved - $2)
      WHERE variant_id = $1
      RETURNING *
    `;
    const res = await query(sql, [variantId, quantity]);
    return res.rows.length > 0;
  },
};
