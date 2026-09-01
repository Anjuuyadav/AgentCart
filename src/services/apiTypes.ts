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

export class ApiErrorClass extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, string[]> | unknown;

  constructor(message: string, statusCode: number, code: string, details?: Record<string, string[]> | unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'ApiErrorClass';
  }
}

export class NetworkError extends ApiErrorClass {
  constructor(message = 'Unable to connect to the server. Please check your internet connection.') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiErrorClass {
  constructor(message = 'The request took too long to complete. Please try again.') {
    super(message, 408, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

export interface ProductQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface AddCartItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
  size: string;
  color: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface EvaluatePolicyPayload {
  productId?: string;
  cartId?: string;
  budget: number;
  size?: string;
  color?: string;
  autoApproveUnderBudget?: boolean;
}

export interface CreateAISessionPayload {
  sessionType: 'buyer' | 'merchant';
  initialQuery?: string;
  requirements?: {
    occasion?: string;
    budget?: number;
    size?: string;
    color?: string;
    category?: string;
  };
}

export interface RecordAIActionPayload {
  actionType: 'search' | 'view' | 'cart' | 'purchase' | 'compare' | 'analyze' | 'recommend';
  query?: string;
  productId?: string;
  productName?: string;
  matchScore?: number;
  revenue?: number;
  metadata?: Record<string, unknown>;
}
