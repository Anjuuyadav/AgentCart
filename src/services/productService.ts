import { products, getProductById, DEMO_QUERY, FEATURED_PRODUCT_ID } from '../data/mockData';
import type { Product, BuyerRequirements, ChatMessage, PurchasePolicy } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiBuyerService = {
  async processQuery(query: string): Promise<{ messages: ChatMessage[]; requirements: BuyerRequirements; productIds: string[] }> {
    const isDemoQuery = query.toLowerCase().includes('wine') && query.toLowerCase().includes('wedding') && query.toLowerCase().includes('5,000');

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

    const productIds = products.slice(0, 4).map((p) => p.id);

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
    const product = getProductById(productId);
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

export const productService = {
  getAll(): Product[] {
    return products;
  },

  getById(id: string): Product | undefined {
    return getProductById(id);
  },

  search(query: string): Product[] {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.category.includes(q)
    );
  },

  getByCategory(category: string): Product[] {
    if (!category || category === 'all') return products;
    return products.filter((p) => p.category === category);
  },

  getRelated(productId: string): Product[] {
    const product = getProductById(productId);
    if (!product) return [];
    return products.filter((p) => p.id !== productId && (p.category === product.category || p.tags.some((t) => product.tags.includes(t)))).slice(0, 4);
  },
};
