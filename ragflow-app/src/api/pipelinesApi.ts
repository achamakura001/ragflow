/**
 * pipelinesApi.ts – API calls for the Pipeline builder.
 *
 * PUT  /api/v1/pipelines                       → create draft (returns pipeline_id)
 * POST /api/v1/pipelines/{id}                  → update draft at each step
 * POST /api/v1/pipelines/{id}/confirm          → finalise draft → active
 * GET  /api/v1/pipelines/chunking-strategies   → list chunking strategies
 * GET  /api/v1/pipelines                       → list all pipelines for tenant
 * DELETE /api/v1/pipelines/{id}               → delete a pipeline
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

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChunkingStrategy {
  id: number;
  slug: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface PipelineRead {
  id: string;
  tenant_id: string;
  created_by_user_id: number | null;
  name: string;
  description: string | null;
  tags: string[];
  environment: string;
  status: string;
  frequency: string | null;
  scheduled_time: string | null;
  start_date: string | null;
  source_type: string | null;
  source_config: Record<string, unknown> | null;
  chunking_strategy_id: number | null;
  chunking_strategy_name: string | null;
  chunk_size: number | null;
  chunk_overlap: number | null;
  embedding_config_id: string | null;
  embedding_model: string | null;
  vector_db_config_id: string | null;
  created_at: string;
  updated_at: string;
}

// ── API ───────────────────────────────────────────────────────────────────────

/** List all pipelines for the current tenant. */
export function listPipelines(): Promise<{ items: PipelineRead[]; total: number }> {
  return apiFetch('/api/v1/pipelines');
}

/** Step 1: create a draft pipeline. Returns the new pipeline with its id. */
export function createPipelineDraft(body: Record<string, unknown>): Promise<PipelineRead> {
  return apiFetch('/api/v1/pipelines', {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/** Steps 2-6: update the draft pipeline with partial data. */
export function updatePipelineDraft(id: string, body: Record<string, unknown>): Promise<PipelineRead> {
  return apiFetch(`/api/v1/pipelines/${id}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** Step 7: confirm the pipeline (moves status from draft → active). */
export function confirmPipeline(id: string): Promise<PipelineRead> {
  return apiFetch(`/api/v1/pipelines/${id}/confirm`, { method: 'POST' });
}

/** Delete a pipeline by ID. */
export async function deletePipeline(id: string): Promise<void> {
  const res = await fetch(`${BASE}/api/v1/pipelines/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const msg = data?.detail?.[0]?.msg ?? data?.detail ?? `Delete failed (${res.status})`;
    throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
  }
}

/** List supported chunking strategies. */
export function getChunkingStrategies(): Promise<{ items: ChunkingStrategy[]; total: number }> {
  return apiFetch('/api/v1/pipelines/chunking-strategies');
}
