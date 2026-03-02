/**
 * Step 3 – Chunking strategy (fetched from API) + size/overlap tuning.
 */
import React, { useEffect, useState } from 'react';
import type { PipelineFormData } from '../../../types';
import { getChunkingStrategies, type ChunkingStrategy } from '../../../api/pipelinesApi';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

export const Step3Chunking: React.FC<Props> = ({ form, update }) => {
  const [strategies, setStrategies] = useState<ChunkingStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getChunkingStrategies()
      .then(r => setStrategies(r.items.filter(s => s.is_active)))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const showSizeControls =
    form.chunkingStrategySlug === 'fixed_size' ||
    form.chunkingStrategySlug === 'sentence_aware';

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="section-title">Chunking Strategy</div>
      <div className="section-sub">Choose how your documents are split into chunks for embedding.</div>

      {loading && <div className="vs-loading">Loading strategies…</div>}
      {error   && <p className="form-error">{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {strategies.map(s => (
          <div
            key={s.id}
            className={`provider-card${form.chunkingStrategyId === s.id ? ' selected' : ''}`}
            onClick={() => update({ chunkingStrategyId: s.id, chunkingStrategySlug: s.slug })}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && update({ chunkingStrategyId: s.id, chunkingStrategySlug: s.slug })}
          >
            {form.chunkingStrategyId === s.id && <span className="provider-check">&#10003;</span>}
            <div className="provider-card-name">{s.name}</div>
            <div className="provider-card-desc">{s.description}</div>
          </div>
        ))}
      </div>

      {showSizeControls && (
        <>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Chunk Size
              <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{form.chunkSize} chars</span>
            </label>
            <input type="range" min={64} max={8192} step={64} value={form.chunkSize}
              onChange={e => update({ chunkSize: +e.target.value })}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              <span>64</span><span>8192</span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Overlap
              <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{form.chunkOverlap} chars</span>
            </label>
            <input type="range" min={0} max={2048} step={16} value={form.chunkOverlap}
              onChange={e => update({ chunkOverlap: +e.target.value })}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              <span>0</span><span>2048</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

