/**
 * Base HTTP client for the RAGFlow backend API.
 *
 * Set VITE_API_BASE_URL in your .env to point at a real server.
 * When VITE_USE_MOCK=true (or the env var is absent) all service
 * functions fall back to the bundled mock data automatically.
 */

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.ragflow.example.com/v1';

export const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_BASE_URL;

/** Simulate a realistic network delay when using mock data. */
export const mockDelay = (ms = 400) =>
  new Promise<void>((res) => setTimeout(res, ms));

/** Typed wrapper around fetch that throws on non-2xx responses. */
export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${msg}`);
  }
  return res.json() as Promise<T>;
}
