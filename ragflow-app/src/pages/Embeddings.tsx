/**
 * Embeddings - view and configure embedding model providers.
 */
import React, { useState } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { Button } from '../components/ui/Button';

const PROVIDERS = [
  { name: 'openai',      label: 'OpenAI',       desc: 'text-embedding-3-small / large. State-of-the-art quality.', models: ['text-embedding-3-small', 'text-embedding-3-large', 'text-embedding-ada-002'] },
  { name: 'cohere',      label: 'Cohere',        desc: 'embed-english-v3.0. Great for multilingual workloads.',      models: ['embed-english-v3.0', 'embed-multilingual-v3.0'] },
  { name: 'huggingface', label: 'Hugging Face',  desc: 'Open-source models via Inference API.',                      models: ['sentence-transformers/all-mpnet-base-v2', 'BAAI/bge-large-en-v1.5'] },
  { name: 'voyage',      label: 'Voyage AI',     desc: 'High-accuracy embeddings optimised for retrieval.',          models: ['voyage-2', 'voyage-code-2'] },
];

export const Embeddings: React.FC = () => {
  const [selected, setSelected] = useState('openai');
  const [model, setModel]       = useState(PROVIDERS[0].models[0]);
  const [apiKey, setApiKey]     = useState('');

  const provider = PROVIDERS.find(p => p.name === selected)!;

  return (
    <>
      <Topbar title="Embedding Models" actions={<Button>Save Configuration</Button>} />
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><span className="card-title">Provider</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {PROVIDERS.map(p => (
                  <div
                    key={p.name}
                    className={"provider-card" + (selected === p.name ? " selected" : "")}
                    onClick={() => { setSelected(p.name); setModel(p.models[0]); }}
                  >
                    {selected === p.name && <span className="provider-check">✓</span>}
                    <div className="provider-card-name">{p.label}</div>
                    <div className="provider-card-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Model</span></div>
              <div className="form-group">
                <label className="form-label">Select Model</label>
                <select className="form-select" value={model} onChange={e => setModel(e.target.value)}>
                  {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">API Key</label>
                <input className="form-input" type="password" placeholder="sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
                <span className="form-sublabel">Stored encrypted. Never logged.</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Usage</span></div>
            {[
              { label: 'Calls this month', value: '78,230' },
              { label: 'Tokens embedded',  value: '42.1M' },
              { label: 'Avg batch size',   value: '128' },
              { label: 'Avg latency',      value: '84ms' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--surface2)' }}>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{s.label}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 600 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
