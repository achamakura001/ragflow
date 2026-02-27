/**
 * RetrievalTest - live query-against-pipeline testing screen.
 */
import React, { useState } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { Button } from '../components/ui/Button';
import { usePipelines } from '../hooks/usePipelines';
import { retrieve } from '../api/retrieval';
import type { RetrievalResult } from '../types';

export const RetrievalTest: React.FC = () => {
  const { pipelines } = usePipelines();
  const [pipelineId, setPipelineId] = useState('');
  const [query, setQuery]           = useState('');
  const [topK, setTopK]             = useState(5);
  const [minScore, setMinScore]     = useState(0.7);
  const [results, setResults]       = useState<RetrievalResult[]>([]);
  const [loading, setLoading]       = useState(false);
  const [latency, setLatency]       = useState<number | null>(null);

  const run = async () => {
    setLoading(true);
    const t0 = performance.now();
    const res = await retrieve({ pipelineId, query, topK, minScore });
    setLatency(Math.round(performance.now() - t0));
    setResults(res);
    setLoading(false);
  };

  return (
    <>
      <Topbar title="Test Retrieval" />
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Query Settings</span></div>

            <div className="form-group">
              <label className="form-label">Pipeline</label>
              <select className="form-select" value={pipelineId} onChange={e => setPipelineId(e.target.value)}>
                <option value="">Select a pipeline...</option>
                {pipelines.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Query</label>
              <textarea
                className="form-textarea"
                placeholder="Enter your retrieval query..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Top-K Results <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{topK}</span>
              </label>
              <input type="range" min={1} max={20} value={topK} onChange={e => setTopK(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Min Score <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{minScore.toFixed(2)}</span>
              </label>
              <input type="range" min={0} max={1} step={0.05} value={minScore} onChange={e => setMinScore(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            </div>

            <Button onClick={run} disabled={loading || !pipelineId || !query.trim()} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Running...' : 'Run Query'}
            </Button>
          </div>

          <div>
            {latency !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <span className="card-title">Results</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{results.length} chunks &middot; {latency}ms</span>
              </div>
            )}
            {results.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-state-icon">?</div>
                <div className="empty-state-title">No results yet</div>
                <div className="empty-state-desc">Select a pipeline and enter a query to test retrieval.</div>
              </div>
            )}
            {results.map((r, i) => (
              <div key={i} className="result-item">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="result-rank">#{i + 1}</span>
                  <span className="result-score">{(r.score * 100).toFixed(1)}%</span>
                </div>
                <div className="result-text">{r.text}</div>
                <div className="result-source">{r.source}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
