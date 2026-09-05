import { writeFile } from 'node:fs/promises';
import {
  FEATURED_PRODUCT_ID,
  CROSS_SELL_PRODUCT_ID,
  products,
  demoOrder,
  aiRecommendations,
  aiInsights,
  auditEvents,
  merchantMetrics,
  analyticsData,
  aiBuyerActivities,
  DEMO_QUERY,
  categoryLabels,
} from '../backend/dist/seed/data.js';

function serializeWithDates(obj) {
  if (obj === null || obj === undefined) return String(obj);
  if (obj instanceof Date) return `new Date("${obj.toISOString()}")`;
  if (Array.isArray(obj)) {
    return `[\n` + obj.map((item) => `  ${serializeWithDates(item)},`).join('\n') + `\n]`;
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj).map(([key, val]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      return `  ${safeKey}: ${serializeWithDates(val)}`;
    });
    return `{\n` + entries.join(',\n') + `\n}`;
  }
  return JSON.stringify(obj);
}

const content = `import type { Product, Order, AIRecommendation, AIInsight, AuditEvent, AnalyticsData, MerchantMetrics, AIBuyerActivity } from '../types';

export const FEATURED_PRODUCT_ID = ${JSON.stringify(FEATURED_PRODUCT_ID)};
export const CROSS_SELL_PRODUCT_ID = ${JSON.stringify(CROSS_SELL_PRODUCT_ID)};

export const products: Product[] = ${serializeWithDates(products)};

export const demoOrder: Order = ${serializeWithDates(demoOrder)};

export const aiRecommendations: AIRecommendation[] = ${serializeWithDates(aiRecommendations)};

export const aiInsights: AIInsight[] = ${serializeWithDates(aiInsights)};

export const auditEvents: AuditEvent[] = ${serializeWithDates(auditEvents)};

export const merchantMetrics: MerchantMetrics = ${serializeWithDates(merchantMetrics)};

export const analyticsData: AnalyticsData = ${serializeWithDates(analyticsData)};

export const aiBuyerActivities: AIBuyerActivity[] = ${serializeWithDates(aiBuyerActivities)};

export const DEMO_QUERY = ${JSON.stringify(DEMO_QUERY)};

export const categoryLabels: Record<string, string> = ${serializeWithDates(categoryLabels)};

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}
`;

await writeFile('src/data/mockData.ts', content, 'utf8');
console.log('Successfully synced src/data/mockData.ts with all 87 products and Date objects');
