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

import type { BuyerRequirements, ChatMessage, PurchasePolicy } from '../types';
import { getProductById as mockGetProductByIdFn } from '../data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiBuyerService = {
  async processQuery(query: string): Promise<{ messages: ChatMessage[]; requirements: BuyerRequirements; productIds: string[] }> {
    const isDemoQuery =
      query.toLowerCase().includes('wine') &&
      query.toLowerCase().includes('wedding') &&
      (query.toLowerCase().includes('5,000') || query.toLowerCase().includes('5000'));

    if (isDemoQuery || query === DEMO_QUERY) {
      await delay(800);
      const requirements: BuyerRequirements = {
        occasion: 'Wedding',
        budget: 5000,
        size: 'M',
        color: 'Wine',
      };

      const productIds = [
        FEATURED_PRODUCT_ID,
        'prod-wedding-dress-002',
        'prod-wedding-dress-003',
        'prod-wedding-dress-004',
      ];

      const messages: ChatMessage[] = [
        {
          id: 'msg-1',
          role: 'assistant',
          content: 'Understanding your requirements...',
          timestamp: new Date(),
          type: 'status',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Requirement understood',
          timestamp: new Date(),
          type: 'requirements',
          requirements,
        },
        {
          id: 'msg-3',
          role: 'assistant',
          content: 'Searching AgentCart...',
          timestamp: new Date(),
          type: 'status',
        },
        {
          id: 'msg-4',
          role: 'assistant',
          content: 'Found 4 strong matches.',
          timestamp: new Date(),
          type: 'recommendations',
          productIds,
        },
      ];

      return { messages, requirements, productIds };
    }

    await delay(600);
    const requirements: BuyerRequirements = {
      occasion: 'General',
      budget: 10000,
      size: 'M',
      color: 'Any',
    };

    const productIds = mockProducts.slice(0, 4).map((p) => p.id);

    return {
      messages: [
        {
          id: 'msg-gen-1',
          role: 'assistant',
          content: 'Understanding your requirements...',
          timestamp: new Date(),
          type: 'status',
        },
        {
          id: 'msg-gen-2',
          role: 'assistant',
          content: 'Found matching products based on your request.',
          timestamp: new Date(),
          type: 'recommendations',
          productIds,
        },
      ],
      requirements,
      productIds,
    };
  },

  getPurchasePolicy(productId: string, budget: number): PurchasePolicy {
    const product = mockGetProductByIdFn(productId);
    if (!product) {
      return { status: 'rejected', checks: [] };
    }

    const checks = [
      { id: 'c1', label: 'Budget limit satisfied', passed: product.price <= budget },
      { id: 'c2', label: 'Product available', passed: product.variants.some((v) => v.stock > 0) },
      { id: 'c3', label: 'Size available', passed: product.variants.some((v) => v.size === 'M' && v.stock > 0) },
      { id: 'c4', label: 'Merchant trusted', passed: true },
      { id: 'c5', label: 'Purchase authorized', passed: true },
    ];

    const allPassed = checks.every((c) => c.passed);

    return {
      status: allPassed ? 'approved' : 'rejected',
      checks,
    };
  },
};

import { DEMO_QUERY, FEATURED_PRODUCT_ID } from '../data/mockData';
