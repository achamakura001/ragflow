/**
 * embeddings.ts – API calls for the Embeddings feature.
 *
 * All requests inject the JWT from localStorage (set by AuthContext).
 * Base URL: http://127.0.0.1:8000
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('ragflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.detail?.[0]?.msg ??
      data?.detail ??
      `Request failed (${res.status})`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
  return data as T;
}

// ── Shared types ─────────────────────────────────────────────────────────────

export type EmbeddingEnv = 'dev' | 'qa' | 'perf' | 'prod';

export interface PropertyDefinition {
  name: string;
  label: string;
  /** 'string' | 'integer' | 'boolean' | 'password' */
  type: string;
  required: boolean;
  secret: boolean;
  placeholder: string | null;
  description: string | null;
  default: unknown;
}

export interface EmbeddingProvider {
  id: number;
  slug: string;
  display_name: string;
  description: string | null;
  models_url: string;
  property_schema: PropertyDefinition[];
}

export interface EmbeddingConfig {
  id: string;
  tenant_id: string;
  provider_id: number;
  provider_slug: string;
  provider_display_name: string;
  name: string;
  environment: EmbeddingEnv;
  properties: Record<string, unknown>;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface EmbeddingModel {
  id: string;
  display_name: string | null;
  description: string | null;
}

export interface TestResult {
  success: boolean;
  message?: string;
  latency_ms?: number;
  [key: string]: unknown;
}

// ── Create / Update request bodies ───────────────────────────────────────────

export interface CreateConfigRequest {
  provider_slug: string;
  name: string;
  environment: EmbeddingEnv;
  properties: Record<string, unknown>;
}

export interface UpdateConfigRequest {
  name?: string | null;
  environment?: EmbeddingEnv | null;
  properties?: Record<string, unknown> | null;
}

// ── API functions ─────────────────────────────────────────────────────────────

/** List all supported embedding providers (with property_schema). */
export function getProviders(): Promise<{ items: EmbeddingProvider[]; total: number }> {
  return apiFetch('/api/v1/embeddings/providers');
}

/** List all embedding configs for the current tenant. */
export function getConfigs(): Promise<{ items: EmbeddingConfig[]; total: number }> {
  return apiFetch('/api/v1/embeddings/configs');
}

/** Get a single config by ID. */
export function getConfig(id: string): Promise<EmbeddingConfig> {
  return apiFetch(`/api/v1/embeddings/configs/${id}`);
}

/** Create a new embedding config. */
export function createConfig(body: CreateConfigRequest): Promise<EmbeddingConfig> {
  return apiFetch('/api/v1/embeddings/configs', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** Update an existing embedding config (partial). */
export function updateConfig(id: string, body: UpdateConfigRequest): Promise<EmbeddingConfig> {
  return apiFetch(`/api/v1/embeddings/configs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/** Test an existing config's credentials. */
export function testConfig(id: string): Promise<TestResult> {
  return apiFetch(`/api/v1/embeddings/configs/${id}/test`, { method: 'POST' });
}

/** Fetch the list of models available for a saved config. */
export function getModels(id: string): Promise<{ items: EmbeddingModel[]; total?: number }> {
  return apiFetch(`/api/v1/embeddings/configs/${id}/models`, { method: 'POST' });
}
