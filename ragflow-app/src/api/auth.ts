/**
 * Auth API – register, verify, and login against the RAGFlow backend.
 * Base URL: http://127.0.0.1:8000
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
  /** Returned in dev/simulation mode so you can skip email. */
  simulated_code?: string | null;
}

export interface VerifyRequest {
  email: string;
  code: string; // 6-digit numeric string
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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

/** Step 1: create account; triggers verification e-mail (or returns simulated_code in dev). */
export function register(req: RegisterRequest): Promise<RegisterResponse> {
  return post('/api/v1/auth/register', req);
}

/** Step 2: confirm e-mail with the 6-digit code. */
export function verify(req: VerifyRequest): Promise<{ message: string }> {
  return post('/api/v1/auth/verify', req);
}

/** Step 3: exchange credentials for a bearer token. */
export function login(req: LoginRequest): Promise<TokenResponse> {
  return post('/api/v1/auth/login', req);
}
