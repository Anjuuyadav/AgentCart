import { apiClient } from './apiClient';
import type { Product, ProductVariant } from '../types';
import type { ProductQueryParams } from './apiTypes';
import { products as mockProducts, getProductById as mockGetProductById, categoryLabels } from '../data/mockData';

function mapBackendProductToFrontend(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    category: p.category,
    image: p.image,
    images: Array.isArray(p.images) ? p.images : [p.image],
    rating: Number(p.rating ?? 0),
    reviewCount: Number(p.reviewCount ?? 0),
    variants: Array.isArray(p.variants) ? p.variants.map((v: any) => ({
      size: v.size,
      color: v.color,
      stock: Number(v.stock ?? 0),
      sku: v.sku,
    })) : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    specifications: p.specifications && typeof p.specifications === 'object' ? p.specifications : {},
    aiMatchScore: p.aiMatchScore ?? undefined,
    aiReasons: p.aiReasons ?? undefined,
  };
}

const USE_MOCK_FALLBACK = false;

async function tryOrMock<T>(fn: () => Promise<T>, mock: T): Promise<T> {
  if (USE_MOCK_FALLBACK) return mock;
  try {
    return await fn();
  } catch (err) {
    if (USE_MOCK_FALLBACK) {
      console.warn('[productService] API failed, using mock fallback', err);
      return mock;
    }
    throw err;
  }
}

export const productService = {
  async getAll(params: ProductQueryParams = {}): Promise<{ products: Product[]; total: number }> {
    return tryOrMock(
      async () => {
        const data = await apiClient.get<Product[]>('/products', params as any);
        const raw = data as any;
        let list: Product[];
        let total: number;
        if (Array.isArray(raw)) {
          list = raw.map(mapBackendProductToFrontend);
          total = list.length;
        } else {
          list = (raw?.data || raw?.items || []).map(mapBackendProductToFrontend);
          total = Number(raw?.meta?.total ?? raw?.total ?? list.length);
        }
        return { products: list, total };
      },
      Promise.resolve({ products: mockProducts.map(mapBackendProductToFrontend), total: mockProducts.length }),
    );
  },

  async getById(id: string): Promise<Product | undefined> {
    return tryOrMock(
      async () => {
        try {
          const p = await apiClient.get<any>(`/products/${encodeURIComponent(id)}`);
          return mapBackendProductToFrontend(p);
        } catch (err: any) {
          if (err?.statusCode === 404 || err?.code === 'NOT_FOUND') {
            return undefined;
          }
          throw err;
        }
      },
      Promise.resolve(mockGetProductById(id)),
    );
  },

  async getVariants(productId: string): Promise<ProductVariant[]> {
    return tryOrMock(
      async () => {
        const vs = await apiClient.get<any[]>(`/products/${encodeURIComponent(productId)}/variants`);
        return (Array.isArray(vs) ? vs : []).map((v: any) => ({
          size: v.size,
          color: v.color,
          stock: Number(v.stock ?? 0),
          sku: v.sku,
        }));
      },
      Promise.resolve(mockGetProductById(productId)?.variants ?? []),
    );
  },

  search(query: string): Product[] {
    const q = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.category.includes(q),
    );
  },

  getByCategory(category: string): Product[] {
    if (!category || category === 'all') return mockProducts;
    return mockProducts.filter((p) => p.category === category);
  },

  getRelated(productId: string): Product[] {
    const product = mockGetProductById(productId);
    if (!product) return [];
    return mockProducts
      .filter(
        (p) =>
          p.id !== productId &&
          (p.category === product.category || p.tags.some((t) => product.tags.includes(t))),
      )
      .slice(0, 4);
  },
};

export const inventoryService = {
  async listAll(): Promise<Array<{
    variantId: string;
    productId: string;
    stock: number;
    reserved: number;
    available: number;
    size?: string;
    color?: string;
    sku?: string;
  }>> {
    return apiClient.get('/inventory');
  },

  async getByProduct(productId: string): Promise<Array<{
    variantId: string;
    productId: string;
    stock: number;
    reserved: number;
    available: number;
    size?: string;
    color?: string;
    sku?: string;
  }>> {
    return apiClient.get(`/inventory/${encodeURIComponent(productId)}`);
  },
};


import { DEMO_QUERY, FEATURED_PRODUCT_ID } from '../data/mockData';
