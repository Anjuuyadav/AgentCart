import { apiClient } from './apiClient';
import type { PurchasePolicy } from '../types';
import type { EvaluatePolicyPayload } from './apiTypes';

export interface BackendPurchasePolicyCheck {
  id: string;
  name: string;
  label: string;
  passed: boolean;
  details?: string;
}

export interface BackendPurchasePolicy {
  id?: string;
  status: 'approved' | 'pending' | 'rejected';
  checks: BackendPurchasePolicyCheck[];
  orderId?: string;
  cartId?: string;
  userId?: string;
  evaluatedBy?: string;
  createdAt?: string;
}

function mapCheck(c: BackendPurchasePolicyCheck): { id: string; label: string; passed: boolean } {
  return {
    id: c.id,
    label: c.label || c.name,
    passed: c.passed,
  };
}

export const purchasePolicyService = {
  async getPolicy(): Promise<PurchasePolicy | undefined> {
    try {
      const p = await apiClient.get<BackendPurchasePolicy>('/purchase-policy');
      if (!p) return undefined;
      return {
        status: p.status,
        checks: (p.checks || []).map(mapCheck),
      };
    } catch (err: any) {
      if (err?.statusCode === 404) return undefined;
      throw err;
    }
  },

  async evaluate(payload: EvaluatePolicyPayload): Promise<PurchasePolicy> {
    const p = await apiClient.post<BackendPurchasePolicy>('/purchase-policy/evaluate', payload);
    return {
      status: p.status,
      checks: (p.checks || []).map(mapCheck),
    };
  },
};
