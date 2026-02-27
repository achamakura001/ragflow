import React from 'react';
import type { PipelineFormData } from '../../../types';

interface Props { form: PipelineFormData; }

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--surface2)', fontSize: 13 }}>
    <span style={{ width: 180, color: 'var(--muted)', flexShrink: 0 }}>{label}</span>
    <span style={{ fontWeight: 500 }}>{value || <span style={{ color: 'var(--muted)' }}>—</span>}</span>
  </div>
);

export const Step7Review: React.FC<Props> = ({ form }) => (
  <div style={{ maxWidth: 560 }}>
    <div className="section-title">Review &amp; Create</div>
    <div className="section-sub">Confirm your pipeline configuration before creating.</div>
    <div className="card" style={{ marginBottom: 16 }}>
      <Row label="Name"             value={form.name} />
      <Row label="Description"      value={form.description} />
      <Row label="Documents"        value={form.documents.length + " file(s)"} />
      <Row label="Chunking"         value={form.chunkingStrategy + " · " + form.chunkSize + " chars · " + form.chunkOverlap + " overlap"} />
      <Row label="Embedding"        value={form.embeddingProvider + " / " + form.embeddingModel} />
      <Row label="Vector Store"     value={form.vectorStore} />
      <Row label="Top-K"            value={form.topK} />
      <Row label="Similarity threshold" value={form.similarityThreshold.toFixed(2)} />
    </div>
    <div className="info-box">
      <span className="info-box-icon">i</span>
      <span>Clicking <strong>Create Pipeline</strong> will start indexing immediately. Monitor progress on the Dashboard.</span>
    </div>
  </div>
);
