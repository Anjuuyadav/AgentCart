export type ProductCategory =
  | 'wedding-dresses'
  | 'dresses'
  | 'sarees'
  | 'kurtis'
  | 'shirts'
  | 't-shirts'
  | 'jeans'
  | 'trousers'
  | 'jackets'
  | 'shoes'
  | 'handbags'
  | 'earrings' 
  | 'necklaces'
  | 'wedding-accessories'
  | 'party-wear';

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  tags: string[];
  specifications: Record<string, string>;
  aiMatchScore?: number;
  aiReasons?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}

export interface BuyerRequirements {
  occasion?: string;
  budget?: number;
  size?: string;
  color?: string;
  category?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'requirements' | 'recommendations' | 'status';
  requirements?: BuyerRequirements;
  productIds?: string[];
}

export type OrderStatus = 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface OrderTimelineEvent {
  id: string;
  label: string;
  timestamp: Date;
  status: 'completed' | 'current' | 'pending';
}

export interface Order {
  id: string;
  orderNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  amount: number;
  quantity: number;
  size: string;
  color: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  isAiBuyerOrder: boolean;
  aiMatchScore?: number;
  timeline: OrderTimelineEvent[];
}

export interface PurchasePolicyCheck {
  id: string;
  label: string;
  passed: boolean;
}

export interface PurchasePolicy {
  status: 'approved' | 'pending' | 'rejected';
  checks: PurchasePolicyCheck[];
}

export interface AIRecommendation {
  id: string;
  type: 'cross-sell' | 'upsell' | 'bundle' | 'offer';
  title: string;
  description: string;
  productIds: string[];
  expectedImpact: string;
  revenueImpact: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'cross-sell' | 'upsell' | 'bundle' | 'offer';
  title: string;
  description: string;
  impact: string;
  createdAt: Date;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  event: string;
  actor: 'AI Buyer' | 'AI Merchant' | 'System' | 'Customer' | 'Merchant';
  status: 'success' | 'info' | 'warning' | 'error';
  relatedOrder?: string;
  relatedProduct?: string;
}

export interface AnalyticsData {
  revenueTrend: { date: string; revenue: number; aiRevenue: number }[];
  ordersTrend: { date: string; orders: number; aiOrders: number }[];
  productPerformance: { name: string; revenue: number; orders: number; aiOrders: number }[];
  conversionMetrics: {
    totalVisitors: number;
    aiBuyerSessions: number;
    conversionRate: number;
    aiConversionRate: number;
    averageOrderValue: number;
    aiAverageOrderValue: number;
  };
}

export interface MerchantMetrics {
  totalRevenue: number;
  aiAttributedRevenue: number;
  orders: number;
  conversionRate: number;
  averageOrderValue: number;
  aiBuyerOrders: number;
}

export interface AIBuyerActivity {
  id: string;
  type: 'search' | 'view' | 'cart' | 'purchase' | 'compare';
  query?: string;
  productId?: string;
  productName?: string;
  matchScore?: number;
  revenue?: number;
  timestamp: Date;
}

export interface UserPreferences {
  budgetLimit: number;
  preferredSizes: string[];
  preferredColors: string[];
  preferredCategories: ProductCategory[];
  autoApproveUnderBudget: boolean;
  aiPersonalization: boolean;
  notifications: boolean;
}

export interface MerchantSettings {
  storeName: string;
  email: string;
  aiRecommendationsEnabled: boolean;
  autoApproveBundles: boolean;
  crossSellEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

export type RecommendationStatus = 'pending' | 'approved' | 'rejected';
