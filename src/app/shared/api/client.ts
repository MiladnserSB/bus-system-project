/**
 * Central API Client Configuration
 * Source: SRS Final v1.0 (Section 3.3, 3.4)
 */

import { SecureStorage } from './secureStore';

export const API_BASE_URL = 'https://api.masar-bus.sy/api/v1';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export function generateIdempotencyKey(): string {
  return 'ik_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: any;
    headers?: Record<string, string>;
    useIdempotency?: boolean;
  } = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, useIdempotency = false } = options;
  const token = await SecureStorage.getAccessToken();

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (useIdempotency && (method === 'POST' || method === 'PATCH')) {
    reqHeaders['Idempotency-Key'] = generateIdempotencyKey();
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err: ApiError = {
        code: data?.code || `HTTP_${res.status}`,
        message: data?.message || 'حدث خطأ أثناء معالجة الطلب',
        details: data?.details,
      };
      throw err;
    }

    return data as T;
  } catch (err: any) {
    if (err?.code) throw err;
    // Network / offline error
    throw {
      code: 'NETWORK_ERROR',
      message: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
    } as ApiError;
  }
}
