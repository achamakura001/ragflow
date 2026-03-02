/**
 * Step 7 – Review all selections, then confirm to activate the pipeline.
 * Each section has an Edit button that jumps directly to that step via goToStep.
 */
import React from 'react';
import type { PipelineFormData } from '../../../types';

interface Props {
  form: PipelineFormData;
  onConfirm: () => void;
  confirming: boolean;
  /** Jump directly to any wizard step (0-based index) */
  goToStep: (step: number) => void;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--surface2)', fontSize: 13 }}>
    <span style={{ width: 200, color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
    <span style={{ fontWeight: 500 }}>{value ?? <span style={{ color: 'var(--muted)' }}>—</span>}</span>
  </div>
);

const SectionHeader: React.FC<{ title: string; stepIndex: number; goToStep: (n: number) => void }> = ({ title, stepIndex, goToStep }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
    <span style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)' }}>
      {title}
    </span>
    <button
      type="button"
      onClick={() => goToStep(stepIndex)}
      style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 4 }}
    >
      ✏️ Edit
    </button>
  </div>
);

export const Step7Review: React.FC<Props> = ({ form, onConfirm, confirming, goToStep }) => (
  <div style={{ maxWidth: 620 }}>
    <div className="section-title">Review &amp; Confirm</div>
    <div className="section-sub">Check your configuration, then confirm to activate the pipeline.</div>

    {/* Step 0: Name & Schedule */}
    <div className="card" style={{ marginBottom: 20 }}>
      <SectionHeader title="Identity &amp; Schedule" stepIndex={0} goToStep={goToStep} />
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

    {/* Step 1: Documents */}
    <div className="card" style={{ marginBottom: 20 }}>
      <SectionHeader title="Document Source" stepIndex={1} goToStep={goToStep} />
      <Row label="Source Type" value={form.docSourceType || undefined} />
      <Row label="Documents"   value={form.docSourceType === 'local' && form.documents.length > 0 ? `${form.documents.length} file(s)` : undefined} />
      {form.docSourceType !== 'local' && Object.entries(form.docSourceConfig).map(([k, v]) => (
        <Row key={k} label={k} value={String(v)} />
      ))}
    </div>

    {/* Step 2: Chunking */}
    <div className="card" style={{ marginBottom: 20 }}>
      <SectionHeader title="Chunking" stepIndex={2} goToStep={goToStep} />
      <Row label="Strategy" value={form.chunkingStrategySlug || undefined} />
      <Row label="Chunk Size" value={form.chunkSize} />
      <Row label="Chunk Overlap" value={form.chunkOverlap} />
    </div>

    {/* Step 3: Embedding */}
    <div className="card" style={{ marginBottom: 20 }}>
      <SectionHeader title="Embedding" stepIndex={3} goToStep={goToStep} />
      <Row label="Provider"    value={form.embeddingProviderSlug || undefined} />
      <Row label="Environment" value={form.embeddingConfigEnv || undefined} />
      <Row label="Config ID"   value={form.embeddingConfigId || undefined} />
      <Row label="Model"       value={form.embeddingModel || undefined} />
    </div>

    {/* Step 4: Vector Store */}
    <div className="card" style={{ marginBottom: 20 }}>
      <SectionHeader title="Vector Store" stepIndex={4} goToStep={goToStep} />
      <Row label="DB Type"      value={form.vectorDbTypeSlug || undefined} />
      <Row label="Connection"   value={form.vectorDbConnectionId || undefined} />
      <Row label="Top-K"        value={form.topK} />
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

