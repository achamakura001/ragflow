import React from 'react';
import type { PipelineFormData } from '../../../types';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

export const Step6Testing: React.FC<Props> = ({ form, update }) => (
  <div style={{ maxWidth: 560 }}>
    <div className="section-title">Retrieval Settings</div>
    <div className="section-sub">Configure how results are retrieved from your pipeline.</div>
    <div className="form-group">
      <label className="form-label">Test Query (optional)</label>
      <textarea
        className="form-textarea"
        placeholder="Enter a test query to preview retrieval results after creation..."
        value={form.testQuery}
        onChange={e => update({ testQuery: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
        Top-K Results <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{form.topK}</span>
      </label>
      <input type="range" min={1} max={20} value={form.topK}
        onChange={e => update({ topK: +e.target.value })} style={{ width: '100%', accentColor: 'var(--accent)' }} />
    </div>
    <div className="form-group">
      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
        Similarity Threshold <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{form.similarityThreshold.toFixed(2)}</span>
      </label>
      <input type="range" min={0} max={1} step={0.05} value={form.similarityThreshold}
        onChange={e => update({ similarityThreshold: +e.target.value })} style={{ width: '100%', accentColor: 'var(--accent)' }} />
      <span className="form-sublabel">Results below this score will be excluded.</span>
    </div>
  </div>
);
