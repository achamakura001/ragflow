import React from 'react';
import type { PipelineFormData } from '../../../types';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

const STRATEGIES = [
  { id: 'fixed',     label: 'Fixed Size',      desc: 'Split by character count. Simple and predictable.' },
  { id: 'sentence',  label: 'Sentence-aware',  desc: 'Respects sentence boundaries. Better for QA.' },
  { id: 'paragraph', label: 'Paragraph-aware', desc: 'Splits on paragraph breaks. Preserves structure.' },
  { id: 'semantic',  label: 'Semantic',         desc: 'AI-powered, groups semantically similar text.' },
];

export const Step3Chunking: React.FC<Props> = ({ form, update }) => (
  <div style={{ maxWidth: 640 }}>
    <div className="section-title">Chunking Strategy</div>
    <div className="section-sub">Choose how your documents are split into chunks for embedding.</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
      {STRATEGIES.map(s => (
        <div key={s.id}
          className={"provider-card" + (form.chunkingStrategy === s.id ? " selected" : "")}
          onClick={() => update({ chunkingStrategy: s.id as PipelineFormData["chunkingStrategy"] })}>
          {form.chunkingStrategy === s.id && <span className="provider-check">✓</span>}
          <div className="provider-card-name">{s.label}</div>
          <div className="provider-card-desc">{s.desc}</div>
        </div>
      ))}
    </div>
    {(form.chunkingStrategy === 'fixed' || form.chunkingStrategy === 'sentence') && (
      <>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Chunk Size <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{form.chunkSize} chars</span>
          </label>
          <input type="range" min={128} max={2048} step={64} value={form.chunkSize}
            onChange={e => update({ chunkSize: +e.target.value })} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Overlap <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{form.chunkOverlap} chars</span>
          </label>
          <input type="range" min={0} max={256} step={16} value={form.chunkOverlap}
            onChange={e => update({ chunkOverlap: +e.target.value })} style={{ width: '100%', accentColor: 'var(--accent)' }} />
        </div>
      </>
    )}
  </div>
);
