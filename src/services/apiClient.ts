import { demoSession } from './session';
import type { ApiResponse, ApiError } from './apiTypes';
import { ApiErrorClass, NetworkError, TimeoutError } from './apiTypes';

const DEFAULT_TIMEOUT = 15000;

function getBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined;
  if (!url) {
    console.warn('[apiClient] VITE_API_URL is not set. Falling back to http://localhost:4000/api');
    return 'http://localhost:4000/api';
  }
  return url.replace(/\/$/, '');
}

function getTimeout(): number {
  const raw = import.meta.env.VITE_API_TIMEOUT as string | undefined;
  if (!raw) return DEFAULT_TIMEOUT;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) || parsed <= 0 ? DEFAULT_TIMEOUT : parsed;
}

async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  options?: {
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
    timeout?: number;
  },
): Promise<T> {
  const baseUrl = getBaseUrl();
  const timeoutMs = options?.timeout ?? getTimeout();

  let url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (options?.params) {
    const usp = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        usp.append(key, String(value));
      }
    });
    const queryString = usp.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...demoSession.getHeaders(),
  };

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      credentials: 'include',
    });

    const rawText = await response.text();
    let parsed: ApiResponse<T>;
    try {
      parsed = rawText ? JSON.parse(rawText) : { success: false };
    } catch {
      throw new ApiErrorClass(
        'Invalid response from server',
        response.status,
        'INVALID_JSON_RESPONSE',
      );
    }

    if (!response.ok || !parsed.success) {
      const err = parsed.error as ApiError | undefined;
      const message = err?.message || response.statusText || 'Request failed';
      const code = err?.code || `HTTP_${response.status}`;
      const details = err?.details;

      if (response.status === 404) {
        throw new ApiErrorClass(message || 'Resource not found', 404, code || 'NOT_FOUND', details);
      }
      if (response.status === 400) {
        throw new ApiErrorClass(message || 'Bad request', 400, code || 'VALIDATION_ERROR', details);
      }
      if (response.status === 409) {
        throw new ApiErrorClass(message || 'Conflict', 409, code || 'CONFLICT', details);
      }
      if (response.status === 500) {
        throw new ApiErrorClass(message || 'Internal server error', 500, code || 'INTERNAL_ERROR', details);
      }
      throw new ApiErrorClass(message, response.status || 500, code, details);
    }

    return (parsed.data ?? (null as unknown)) as T;
  } catch (err: unknown) {
    if (err instanceof ApiErrorClass) {
      if (import.meta.env.DEV) {
        console.error(`[apiClient] ${method} ${url} failed:`, err.message, err.code);
      }
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      const timeoutErr = new TimeoutError();
      if (import.meta.env.DEV) {
        console.error(`[apiClient] ${method} ${url} timed out after ${timeoutMs}ms`);
      }
      throw timeoutErr;
    }

    if (err instanceof TypeError && (err.message.includes('fetch') || err.message.includes('Failed to'))) {
      const netErr = new NetworkError();
      if (import.meta.env.DEV) {
        console.error(`[apiClient] ${method} ${url} network error:`, err.message);
      }
      throw netErr;
    }

    if (err instanceof Error) {
      throw new ApiErrorClass(err.message, 500, 'UNKNOWN_ERROR');
    }

    throw new ApiErrorClass('An unknown error occurred', 500, 'UNKNOWN_ERROR');
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, timeout?: number): Promise<T> {
    return request<T>('GET', endpoint, { params, timeout });
  },

  async post<T>(endpoint: string, body?: unknown, timeout?: number): Promise<T> {
    return request<T>('POST', endpoint, { body, timeout });
  },

  async patch<T>(endpoint: string, body?: unknown, timeout?: number): Promise<T> {
    return request<T>('PATCH', endpoint, { body, timeout });
  },

  async delete<T>(endpoint: string, timeout?: number): Promise<T> {
    return request<T>('DELETE', endpoint, { timeout });
  },
};

export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ApiErrorClass) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case 'TIMEOUT_ERROR':
        return 'The server is taking too long to respond. Please try again.';
      case 'NOT_FOUND':
        return error.message;
      case 'VALIDATION_ERROR':
        if (error.details && typeof error.details === 'object') {
          const details = error.details as Record<string, string[]>;
          const first = Object.values(details)[0];
          if (first && first.length > 0) {
            return first[0];
          }
        }
        return error.message;
      case 'INSUFFICIENT_STOCK':
        return error.message || 'Insufficient stock available for this item.';
      case 'CONFLICT':
        return error.message;
      case 'INTERNAL_ERROR':
        return 'Something went wrong on our end. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
