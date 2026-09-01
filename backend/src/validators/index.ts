import { BadRequestError, ValidationError } from '../middleware/errorHandler.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT_ID_REGEX = /^[a-zA-Z0-9_-]{1,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ORDER_NUMBER_REGEX = /^[A-Z]{2}-\d+$/;

export function isUUID(value: unknown): value is string {
  return typeof value === 'string' && UUID_REGEX.test(value);
}

export function isProductId(value: unknown): value is string {
  return typeof value === 'string' && PRODUCT_ID_REGEX.test(value);
}

export function isEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_REGEX.test(value);
}

export function isOrderNumber(value: unknown): value is string {
  return typeof value === 'string' && ORDER_NUMBER_REGEX.test(value);
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && Number.isFinite(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isEnumValue<T extends string>(value: unknown, enumValues: readonly T[]): value is T {
  return typeof value === 'string' && enumValues.includes(value as T);
}

export function validateUUID(value: unknown, field: string = 'id'): string {
  if (!isUUID(value)) {
    throw new ValidationError(`Invalid ${field}: must be a valid UUID`, { [field]: ['Must be a valid UUID'] });
  }
  return value;
}

export function validateProductId(value: unknown, field: string = 'productId'): string {
  if (!isProductId(value)) {
    throw new ValidationError(`Invalid ${field}: must be 1-50 chars (letters, numbers, -, _)`, {
      [field]: ['Must be 1-50 characters, letters/numbers/-/_ only'],
    });
  }
  return value;
}

export function validateRequired<T>(value: unknown, field: string): T {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(`${field} is required`, { [field]: ['Required'] });
  }
  return value as T;
}

export function validatePositiveInteger(value: unknown, field: string): number {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  if (!isPositiveInteger(num)) {
    throw new ValidationError(`${field} must be a positive integer`, {
      [field]: ['Must be a positive integer'],
    });
  }
  return num;
}

export function validatePositiveNumber(value: unknown, field: string): number {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (!isPositiveNumber(num)) {
    throw new ValidationError(`${field} must be a positive number`, {
      [field]: ['Must be a positive number'],
    });
  }
  return num;
}

export function validateEnum<T extends string>(
  value: unknown,
  enumValues: readonly T[],
  field: string,
): T {
  if (!isEnumValue(value, enumValues)) {
    throw new ValidationError(
      `Invalid ${field}. Must be one of: ${enumValues.join(', ')}`,
      { [field]: [`Must be one of: ${enumValues.join(', ')}`] },
    );
  }
  return value;
}

export function validateEmail(value: unknown, field: string = 'email'): string {
  if (!isEmail(value)) {
    throw new ValidationError(`Invalid ${field} format`, { [field]: ['Invalid email format'] });
  }
  return value;
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  field: string,
): number {
  if (value < min || value > max) {
    throw new ValidationError(`${field} must be between ${min} and ${max}`, {
      [field]: [`Must be between ${min} and ${max}`],
    });
  }
  return value;
}

export function validateArray<T>(
  value: unknown,
  field: string,
  itemValidator?: (item: unknown, idx: number) => T,
): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${field} must be an array`, { [field]: ['Must be an array'] });
  }
  if (itemValidator) {
    return value.map((item, idx) => itemValidator(item, idx));
  }
  return value as T[];
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
  limit: number;
  offset: number;
}

export function validateProductQuery(query: Record<string, unknown>): ProductQueryParams {
  const errors: Record<string, string[]> = {};
  const result: ProductQueryParams = {
    limit: 50,
    offset: 0,
  };

  if (query.category !== undefined && query.category !== null && query.category !== '') {
    result.category = String(query.category);
  }

  if (query.minPrice !== undefined && query.minPrice !== null && query.minPrice !== '') {
    const n = parseFloat(String(query.minPrice));
    if (!Number.isFinite(n) || n < 0) {
      errors.minPrice = ['Must be a non-negative number'];
    } else {
      result.minPrice = n;
    }
  }

  if (query.maxPrice !== undefined && query.maxPrice !== null && query.maxPrice !== '') {
    const n = parseFloat(String(query.maxPrice));
    if (!Number.isFinite(n) || n < 0) {
      errors.maxPrice = ['Must be a non-negative number'];
    } else {
      result.maxPrice = n;
    }
  }

  if (result.minPrice !== undefined && result.maxPrice !== undefined && result.minPrice > result.maxPrice) {
    errors.minPrice = errors.minPrice || [];
    errors.minPrice.push('minPrice must be less than or equal to maxPrice');
  }

  if (query.size) result.size = String(query.size);
  if (query.color) result.color = String(query.color);
  if (query.search) result.search = String(query.search);

  if (query.sort) {
    const sort = String(query.sort);
    const allowed = ['price', 'name', 'rating', 'createdAt', 'reviewCount'];
    if (!allowed.includes(sort)) {
      errors.sort = [`Must be one of: ${allowed.join(', ')}`];
    } else {
      result.sort = sort;
    }
  }

  if (query.order) {
    const order = String(query.order).toLowerCase();
    if (order !== 'asc' && order !== 'desc') {
      errors.order = ['Must be "asc" or "desc"'];
    } else {
      result.order = order as 'asc' | 'desc';
    }
  }

  if (query.limit !== undefined && query.limit !== null && query.limit !== '') {
    const n = parseInt(String(query.limit), 10);
    if (!Number.isInteger(n) || n <= 0 || n > 200) {
      errors.limit = ['Must be an integer between 1 and 200'];
    } else {
      result.limit = n;
    }
  }

  if (query.offset !== undefined && query.offset !== null && query.offset !== '') {
    const n = parseInt(String(query.offset), 10);
    if (!Number.isInteger(n) || n < 0) {
      errors.offset = ['Must be a non-negative integer'];
    } else {
      result.offset = n;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Invalid query parameters', errors);
  }

  return result;
}

export interface CartItemRequest {
  productId: string;
  variantId?: string;
  quantity: number;
  size: string;
  color: string;
}

export function validateCartItemPayload(body: Record<string, unknown>): CartItemRequest {
  const errors: Record<string, string[]> = {};
  const result: Partial<CartItemRequest> = {};

  try {
    result.productId = validateProductId(body.productId, 'productId');
  } catch (e) {
    const err = e as ValidationError;
    Object.assign(errors, err.details || {});
  }

  if (body.variantId !== undefined && body.variantId !== null && body.variantId !== '') {
    try {
      result.variantId = validateUUID(body.variantId, 'variantId');
    } catch (e) {
      const err = e as ValidationError;
      Object.assign(errors, err.details || {});
    }
  }

  try {
    result.quantity = validatePositiveInteger(body.quantity, 'quantity');
    if (result.quantity > 999) {
      errors.quantity = errors.quantity || [];
      errors.quantity.push('Maximum quantity is 999');
    }
  } catch (e) {
    const err = e as ValidationError;
    Object.assign(errors, err.details || {});
  }

  try {
    result.size = validateRequired<string>(body.size, 'size');
  } catch (e) {
    const err = e as ValidationError;
    Object.assign(errors, err.details || {});
  }

  try {
    result.color = validateRequired<string>(body.color, 'color');
  } catch (e) {
    const err = e as ValidationError;
    Object.assign(errors, err.details || {});
  }

  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Invalid cart item payload', errors);
  }

  return result as CartItemRequest;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export function validateUpdateCartItemPayload(body: Record<string, unknown>): UpdateCartItemRequest {
  return {
    quantity: validatePositiveInteger(body.quantity, 'quantity'),
  };
}

export function throwValidationError(message: string, details?: Record<string, string[]>): never {
  throw new ValidationError(message, details);
}

export function throwBadRequest(message: string, code: string = 'BAD_REQUEST', details?: unknown): never {
  throw new BadRequestError(message, code, details);
}
