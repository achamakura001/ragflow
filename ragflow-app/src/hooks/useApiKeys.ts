/**
 * useApiKeys – loads and manages API keys.
 */

import { useState, useEffect, useCallback } from 'react';
import { getApiKeys, revokeApiKey } from '../api/apiKeys';
import type { ApiKey } from '../types';

interface ApiKeysState {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
  revoke: (id: string) => Promise<void>;
  refresh: () => void;
}

/** Returns the tenant's API key list with revoke action. */
export function useApiKeys(): ApiKeysState {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApiKeys();
      setKeys(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const revoke = async (id: string) => {
    await revokeApiKey(id);
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k)),
    );
  };

  return { keys, loading, error, revoke, refresh: load };
}
