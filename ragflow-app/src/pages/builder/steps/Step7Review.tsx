/**
 * Step 7 – Review all selections, then confirm to activate the pipeline.
 * The parent PipelineBuilder passes `onConfirm` which calls POST /confirm.
 */
import React from 'react';
import type { PipelineFormData } from '../../../types';

interface Props {
  form: PipelineFormData;
  onConfirm: () => void;
  confirming: boolean;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--surface2)', fontSize: 13 }}>
    <span style={{ width: 200, color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
    <span style={{ fontWeight: 500 }}>{value ?? <span style={{ color: 'var(--muted)' }}>—</span>}</span>
  </div>
);

export const Step7Review: React.FC<Props> = ({ form, onConfirm, confirming }) => (
  <div style={{ maxWidth: 620 }}>
    <div className="section-title">Review &amp; Confirm</div>
    <div className="section-sub">Check your configuration, then confirm to activate the pipeline.</div>

    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 8 }}>
        Identity &amp; Schedule
      </div>
      <Row label="Name"           value={form.name} />
      <Row label="Description"    value={form.description} />
      <Row label="Tags"           value={form.tags.join(', ') || undefined} />
      <Row label="Environment"    value={<span className={`badge badge-${form.environment === 'prod' ? 'red' : 'blue'}`}>{form.environment}</span>} />
      <Row label="Frequency"      value={form.frequency || 'One-time / Manual'} />
      {form.frequency && <>
        <Row label="Scheduled Time" value={form.scheduled_time || undefined} />
        <Row label="Start Date"     value={form.start_date || undefined} />
      </>}
    </div>

    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 8 }}>
        Pipeline Configuration
      </div>
      <Row label="Documents"      value={`${form.documents.length} file(s)`} />
      <Row label="Chunking"       value={form.chunkingStrategySlug
        ? `${form.chunkingStrategySlug} · ${form.chunkSize} chars · ${form.chunkOverlap} overlap`
        : undefined} />
      <Row label="Embedding"      value={form.embeddingConfigId
        ? `${form.embeddingProviderSlug} · ${form.embeddingModel}`
        : undefined} />
      <Row label="Vector Store"   value={form.vectorDbConnectionId
        ? `${form.vectorDbTypeSlug} · ${form.vectorDbConnectionId.slice(0, 8)}…`
        : undefined} />
      <Row label="Top-K"          value={form.topK} />
      <Row label="Similarity Threshold" value={form.similarityThreshold.toFixed(2)} />
    </div>

    {form._pipelineId && (
      <div className="info-box" style={{ marginBottom: 20 }}>
        <span className="info-box-icon">i</span>
        <span>Draft saved as <code>{form._pipelineId.slice(0, 8)}…</code> — clicking <strong>Confirm Pipeline</strong> will activate it.</span>
      </div>
    )}

    <button
      type="button"
      className="btn btn-primary"
      onClick={onConfirm}
      disabled={confirming || !form._pipelineId}
      style={{ width: '100%', padding: '14px', fontSize: 15 }}
    >
      {confirming ? 'Confirming…' : 'Confirm Pipeline'}
    </button>

    {!form._pipelineId && (
      <p className="form-error" style={{ marginTop: 12 }}>
        No draft pipeline found — go back to Step 1 and continue.
      </p>
    )}
  </div>
);

