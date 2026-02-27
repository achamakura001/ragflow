/**
 * usePipelines – loads and manages the pipeline list.
 */

import { useState, useEffect, useCallback } from 'react';
import { getPipelines, runPipeline } from '../api/pipelines';
import type { Pipeline } from '../types';

interface PipelinesState {
  pipelines: Pipeline[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  triggerRun: (id: string) => Promise<void>;
}

/** Returns the full pipeline list with loading state and run action. */
export function usePipelines(): PipelinesState {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPipelines();
      setPipelines(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const triggerRun = async (id: string) => {
    await runPipeline(id);
    // Optimistically mark as indexing
    setPipelines((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'indexing', lastRun: 'Running…' } : p)),
    );
  };

  return { pipelines, loading, error, refresh: load, triggerRun };
}
