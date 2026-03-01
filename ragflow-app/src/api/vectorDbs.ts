/**
 * vectorDbs.ts – API calls for the Vector DB management feature.
 *
 * All requests inject the JWT stored in localStorage by the AuthContext.
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

// ── Types ────────────────────────────────────────────────────────────────────

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

export interface VectorDbType {
  id: number;
  slug: string;
  display_name: string;
  description: string | null;
  property_schema: PropertyDefinition[];
}

export type VectorDbEnv = 'dev' | 'qa' | 'perf' | 'prod';

export interface VectorDbConnection {
  id: string;
  tenant_id: string;
  type_id: number;
  type_slug: string;
  type_display_name: string;
  name: string;
  environment: VectorDbEnv;
  properties: Record<string, unknown>;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface ConnectionCreateRequest {
  type_slug: string;
  name: string;
  environment: VectorDbEnv;
  properties: Record<string, unknown>;
}

export interface TestResult {
  success: boolean;
  message?: string;
  latency_ms?: number;
  [key: string]: unknown;
}

// ── API functions ─────────────────────────────────────────────────────────────

/** List all supported vector DB types (with their property schema). */
export function getSupportedDbs(): Promise<{ items: VectorDbType[]; total: number }> {
  return apiFetch('/api/v1/vector-dbs/supported');
}

/** List all connections for the current tenant. */
export function getConnections(): Promise<{ items: VectorDbConnection[]; total: number }> {
  return apiFetch('/api/v1/vector-dbs/connections');
}

/** Get a single connection by ID. */
export function getConnection(id: string): Promise<VectorDbConnection> {
  return apiFetch(`/api/v1/vector-dbs/connections/${id}`);
}

/** Create a new connection. */
export function createConnection(body: ConnectionCreateRequest): Promise<VectorDbConnection> {
  return apiFetch('/api/v1/vector-dbs/connections', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** Test an existing connection. */
export function testConnection(id: string): Promise<TestResult> {
  return apiFetch(`/api/v1/vector-dbs/connections/${id}/test`, { method: 'POST' });
}
