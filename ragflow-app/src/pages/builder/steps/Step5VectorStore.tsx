import React from 'react';
import type { PipelineFormData } from '../../../types';
import { ProviderCard } from '../../../components/ui/ProviderCard';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

const STORES = [
  { logo: 'PNE', name: 'pinecone', label: 'Pinecone',  desc: 'Managed, serverless' },
  { logo: 'PG',  name: 'pgvector', label: 'pgvector',  desc: 'PostgreSQL extension' },
  { logo: 'QDR', name: 'qdrant',   label: 'Qdrant',    desc: 'Open-source, fast' },
  { logo: 'RDS', name: 'redis',    label: 'Redis',     desc: 'Ultra-low latency' },
  { logo: 'WVT', name: 'weaviate', label: 'Weaviate',  desc: 'Hybrid search built-in' },
  { logo: 'MLV', name: 'milvus',   label: 'Milvus',    desc: 'Billion-scale workloads' },
];

export const Step5VectorStore: React.FC<Props> = ({ form, update }) => (
  <div style={{ maxWidth: 640 }}>
    <div className="section-title">Vector Store</div>
    <div className="section-sub">Choose where your embeddings will be stored and searched.</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
      {STORES.map(s => (
        <ProviderCard
          key={s.name}
          logo={s.logo} name={s.label} desc={s.desc}
          selected={form.vectorStore === s.name}
          onClick={() => update({ vectorStore: s.name })}
        />
      ))}
    </div>
    {form.vectorStore && (
      <>
        <div className="form-group">
          <label className="form-label">Host / Endpoint</label>
          <input className="form-input" placeholder="https://..." onChange={e => update({ vectorStoreConfig: { ...form.vectorStoreConfig, host: e.target.value } })} />
        </div>
        <div className="form-group">
          <label className="form-label">API Key / Password</label>
          <input className="form-input" type="password" placeholder="sk-..." onChange={e => update({ vectorStoreConfig: { ...form.vectorStoreConfig, apiKey: e.target.value } })} />
        </div>
        <div className="form-group">
          <label className="form-label">Namespace / Index</label>
          <input className="form-input" placeholder="ragflow-prod" onChange={e => update({ vectorStoreConfig: { ...form.vectorStoreConfig, namespace: e.target.value } })} />
        </div>
      </>
    )}
  </div>
);
