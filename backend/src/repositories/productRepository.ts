import { query } from '../config/database.js';
import type { Product, ProductVariant } from '../types/index.js';
import { ProductQueryParams } from '../validators/index.js';

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    merchantId: row.merchant_id as string | undefined,
    name: row.name as string,
    description: (row.description as string) || '',
    price: parseFloat(String(row.price)),
    originalPrice: row.original_price !== null && row.original_price !== undefined
      ? parseFloat(String(row.original_price))
      : undefined,
    category: row.category as Product['category'],
    image: row.image as string,
    images: (row.images as string[]) || [],
    rating: parseFloat(String(row.rating || 0)),
    reviewCount: parseInt(String(row.review_count || 0), 10),
    variants: [],
    tags: (row.tags as string[]) || [],
    specifications: (row.specifications as Record<string, string>) || {},
    isActive: row.is_active as boolean | undefined,
    createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at as string) : undefined,
  };
}

function rowToVariant(row: Record<string, unknown>): ProductVariant {
  return {
    id: row.id as string | undefined,
    size: row.size as string,
    color: row.color as string,
    stock: parseInt(String(row.stock || 0), 10),
    sku: (row.sku as string) || '',
  };
}

export const productRepository = {
  async findMany(params: ProductQueryParams): Promise<{ products: Product[]; total: number }> {
    const whereClauses: string[] = ['p.is_active = TRUE'];
    const values: unknown[] = [];
    let paramIdx = 1;

    if (params.category) {
      whereClauses.push(`p.category = $${paramIdx++}`);
      values.push(params.category);
    }
    if (params.minPrice !== undefined) {
      whereClauses.push(`p.price >= $${paramIdx++}`);
      values.push(params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      whereClauses.push(`p.price <= $${paramIdx++}`);
      values.push(params.maxPrice);
    }
    if (params.search) {
      whereClauses.push(`(
        p.name ILIKE $${paramIdx++}
        OR p.description ILIKE $${paramIdx}
        OR p.tags::text ILIKE $${paramIdx}
        OR p.category ILIKE $${paramIdx}
      )`);
      paramIdx++;
      values.push(`%${params.search}%`);
    }
    if (params.size || params.color) {
      const variantJoins: string[] = [];
      if (params.size) {
        variantJoins.push(`v.size = $${paramIdx++}`);
        values.push(params.size);
      }
      if (params.color) {
        variantJoins.push(`v.color = $${paramIdx++}`);
        values.push(params.color);
      }
      whereClauses.push(`
        EXISTS (
          SELECT 1 FROM product_variants v
          WHERE v.product_id = p.id AND ${variantJoins.join(' AND ')}
        )
      `);
    }

    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    let orderBy = 'ORDER BY p.created_at DESC';
    if (params.sort) {
      const sortMap: Record<string, string> = {
        price: 'p.price',
        name: 'p.name',
        rating: 'p.rating',
        reviewCount: 'p.review_count',
        createdAt: 'p.created_at',
      };
      const col = sortMap[params.sort] || 'p.created_at';
      const dir = params.order === 'asc' ? 'ASC' : 'DESC';
      orderBy = `ORDER BY ${col} ${dir}`;
    }

    const countSql = `SELECT COUNT(*) FROM products p ${where}`;
    const countRes = await query(countSql, values);
    const total = parseInt(String(countRes.rows[0].count), 10);

    const dataSql = `
      SELECT p.* FROM products p
      ${where}
      ${orderBy}
      LIMIT $${paramIdx++} OFFSET $${paramIdx}
    `;
    values.push(params.limit, params.offset);

    const dataRes = await query(dataSql, values);
    const products = dataRes.rows.map(rowToProduct);

    return { products, total };
  },

  async findById(id: string): Promise<Product | null> {
    const sql = `SELECT * FROM products WHERE id = $1`;
    const res = await query(sql, [id]);
    if (res.rows.length === 0) return null;
    const product = rowToProduct(res.rows[0]);
    product.variants = await this.findVariantsByProductId(id);
    return product;
  },

  async findVariantsByProductId(productId: string): Promise<ProductVariant[]> {
    const sql = `
      SELECT
        v.id,
        v.size,
        v.color,
        v.sku,
        v.price_override,
        COALESCE(i.stock, 0) AS stock
      FROM product_variants v
      LEFT JOIN inventory i ON i.variant_id = v.id
      WHERE v.product_id = $1
      ORDER BY v.size, v.color
    `;
    const res = await query(sql, [productId]);
    return res.rows.map(rowToVariant);
  },

  async findBasicById(id: string): Promise<Product | null> {
    const sql = `SELECT * FROM products WHERE id = $1 AND is_active = TRUE`;
    const res = await query(sql, [id]);
    if (res.rows.length === 0) return null;
    return rowToProduct(res.rows[0]);
  },
};
