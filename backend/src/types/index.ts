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
  id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  merchantId?: string;
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
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
  size: string;
  color: string;
  variantId?: string;
  unitPrice?: number;
  productName?: string;
  productImage?: string;
  productPrice?: number;
}

export interface Cart {
  id?: string;
  userId?: string;
  sessionId?: string;
  status?: 'active' | 'checked_out' | 'abandoned';
  items: CartItem[];
  subtotal?: number;
  total?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderStatus = 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface OrderTimelineEvent {
  id: string;
  label: string;
  timestamp: Date;
  status: 'completed' | 'current' | 'pending';
}

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  productImage?: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  color?: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  userId?: string;
  cartId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  isAiBuyerOrder: boolean;
  aiMatchScore?: number;
  timeline: OrderTimelineEvent[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  isAiBuyerOrder?: boolean;
  aiMatchScore?: number;
}

export interface PurchasePolicyCheck {
  id: string;
  name: string;
  label: string;
  passed: boolean;
  details?: string;
}

export interface PurchasePolicy {
  id?: string;
  status: 'approved' | 'pending' | 'rejected';
  checks: PurchasePolicyCheck[];
  orderId?: string;
  cartId?: string;
  userId?: string;
  evaluatedBy?: string;
  createdAt?: Date;
}

export interface EvaluatePolicyRequest {
  productId?: string;
  cartId?: string;
  budget: number;
  size?: string;
  color?: string;
  autoApproveUnderBudget?: boolean;
}

export type RecommendationType = 'cross-sell' | 'upsell' | 'bundle' | 'offer';
export type RecommendationStatus = 'pending' | 'approved' | 'rejected';

export interface AIRecommendation {
  id?: string;
  type: RecommendationType;
  title: string;
  description: string;
  productIds: string[];
  expectedImpact: string;
  revenueImpact: number;
  status: RecommendationStatus;
  createdAt?: Date;
}

export type InsightType = 'pattern' | 'cross-sell' | 'upsell' | 'bundle' | 'offer';

export interface AIInsight {
  id?: string;
  type: InsightType;
  title: string;
  description: string;
  impact: string;
  createdAt?: Date;
}

export type AuditActor = 'ai_buyer' | 'ai_merchant' | 'system' | 'customer' | 'merchant';
export type AuditStatus = 'success' | 'info' | 'warning' | 'error';

export interface AuditLog {
  id?: string;
  actor: AuditActor;
  actorId?: string;
  event: string;
  status: AuditStatus;
  relatedOrderId?: string;
  relatedOrderNumber?: string;
  relatedProductId?: string;
  relatedProductName?: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
}

export type AISessionType = 'buyer' | 'merchant';
export type AIActionType = 'search' | 'view' | 'cart' | 'purchase' | 'compare' | 'analyze' | 'recommend';

export interface BuyerRequirements {
  occasion?: string;
  budget?: number;
  size?: string;
  color?: string;
  category?: string;
}

export interface AISession {
  id?: string;
  userId?: string;
  sessionType: AISessionType;
  initialQuery?: string;
  requirements?: BuyerRequirements;
  status?: string;
  startedAt?: Date;
  endedAt?: Date;
  createdAt?: Date;
}

export interface AIAction {
  id?: string;
  aiSessionId?: string;
  userId?: string;
  actionType: AIActionType;
  query?: string;
  productId?: string;
  productName?: string;
  matchScore?: number;
  revenue?: number;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
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

export interface InventoryItem {
  id?: string;
  variantId: string;
  productId: string;
  stock: number;
  reserved: number;
  available: number;
  size?: string;
  color?: string;
  sku?: string;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
    page?: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]> | unknown;
}

export type SortDirection = 'asc' | 'desc';
