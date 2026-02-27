import React from 'react';
import type { PipelineFormData } from '../../../types';
import { ProviderCard } from '../../../components/ui/ProviderCard';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

const PROVIDERS = [
  { logo: 'OpenAI',    name: 'openai',      label: 'OpenAI',       desc: 'text-embedding-3-small / large',  models: ['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002'] },
  { logo: 'Cohere',    name: 'cohere',      label: 'Cohere',       desc: 'Multilingual v3.0',                models: ['embed-english-v3.0', 'embed-multilingual-v3.0'] },
  { logo: 'HF',        name: 'huggingface', label: 'Hugging Face', desc: 'Open-source inference',            models: ['BAAI/bge-large-en-v1.5', 'sentence-transformers/all-mpnet-base-v2'] },
  { logo: 'Voyage',    name: 'voyage',      label: 'Voyage AI',    desc: 'Optimised for retrieval',          models: ['voyage-2', 'voyage-code-2'] },
];

export const Step4Embedding: React.FC<Props> = ({ form, update }) => {
  const provider = PROVIDERS.find(p => p.name === form.embeddingProvider);
  return (
    <div style={{ maxWidth: 640 }}>
      <div className="section-title">Embedding Model</div>
      <div className="section-sub">Choose the model that will convert your documents into vectors.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        {PROVIDERS.map(p => (
          <ProviderCard
            key={p.name}
            logo={p.logo} name={p.label} desc={p.desc}
            selected={form.embeddingProvider === p.name}
            onClick={() => update({ embeddingProvider: p.name, embeddingModel: p.models[0] })}
          />
        ))}
      </div>
      {provider && (
        <>
          <div className="form-group">
            <label className="form-label">Model</label>
            <select className="form-select" value={form.embeddingModel} onChange={e => update({ embeddingModel: e.target.value })}>
              {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">API Key</label>
            <input className="form-input" type="password" placeholder="sk-..." value={form.embeddingApiKey}
              onChange={e => update({ embeddingApiKey: e.target.value })} />
            <span className="form-sublabel">Stored encrypted. Used only at indexing time.</span>
          </div>
        </>
      )}
    </div>
  );
};
