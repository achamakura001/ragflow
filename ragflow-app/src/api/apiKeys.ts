/**
 * API Keys service.
 * Manages create / list / revoke operations for tenant API keys.
 */

import { apiFetch, USE_MOCK, mockDelay } from './client';
import { mockApiKeys } from './mock/apiKeys';
import type { ApiKey } from '../types';

/** Fetch all API keys for the current tenant. */
export async function getApiKeys(): Promise<ApiKey[]> {
  if (USE_MOCK) {
    await mockDelay();
    return [...mockApiKeys];
  }
  return apiFetch<ApiKey[]>('/api-keys');
}

/** Generate a new API key. */
export async function generateApiKey(name: string, scope: string): Promise<ApiKey> {
  if (USE_MOCK) {
    await mockDelay(600);
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name,
      key: `rf_new_${'*'.repeat(20)}${Math.random().toString(36).slice(2, 6)}`,
      scope,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      calls30d: 0,
      status: 'active',
    };
    mockApiKeys.unshift(newKey);
    return newKey;
  }
  return apiFetch<ApiKey>('/api-keys', {
    method: 'POST',
    body: JSON.stringify({ name, scope }),
  });
}

/** Revoke an existing API key. */
export async function revokeApiKey(id: string): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(300);
    const key = mockApiKeys.find((k) => k.id === id);
    if (key) key.status = 'revoked';
    return;
  }
  return apiFetch<void>(`/api-keys/${id}/revoke`, { method: 'POST' });
}
