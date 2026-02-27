/**
 * VectorStores - manage vector database connections.
 */
import React, { useState } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { Button } from '../components/ui/Button';

const PROVIDERS = [
  { logo: 'PNE', name: 'pinecone', label: 'Pinecone',  desc: 'Managed, serverless vector DB. Excellent performance at scale.' },
  { logo: 'PG',  name: 'pgvector', label: 'pgvector',  desc: 'PostgreSQL extension. Great if you already run Postgres.' },
  { logo: 'QDR', name: 'qdrant',   label: 'Qdrant',    desc: 'Open-source, on-prem or cloud. High performance.' },
  { logo: 'RDS', name: 'redis',    label: 'Redis',     desc: 'RediSearch module. Ultra-low latency for smaller datasets.' },
  { logo: 'WVT', name: 'weaviate', label: 'Weaviate',  desc: 'Open-source with built-in GraphQL and hybrid search.' },
  { logo: 'MLV', name: 'milvus',   label: 'Milvus',    desc: 'Highly scalable, designed for billion-scale workloads.' },
];

export const VectorStores: React.FC = () => {
  const [selected, setSelected] = useState('pinecone');
  const [host, setHost]         = useState('');
  const [apiKey, setApiKey]     = useState('');
  const [namespace, setNamespace] = useState('');

  return (
    <>
      <Topbar title="Vector Stores" actions={<Button>Save &amp; Test Connection</Button>} />
      <div className="content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><span className="card-title">Provider</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {PROVIDERS.map(p => (
                  <div
                    key={p.name}
                    className={"provider-card" + (selected === p.name ? " selected" : "")}
                    onClick={() => setSelected(p.name)}
                  >
                    {selected === p.name && <span className="provider-check">&#10003;</span>}
                    <div className="provider-card-logo" style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>{p.logo}</div>
                    <div className="provider-card-name">{p.label}</div>
                    <div className="provider-card-desc">{p.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Connection</span></div>
              <div className="form-group">
                <label className="form-label">Host / Endpoint</label>
                <input className="form-input" placeholder="https://..." value={host} onChange={e => setHost(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">API Key / Password</label>
                <input className="form-input" type="password" placeholder="sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Namespace / Index</label>
                <input className="form-input" placeholder="ragflow-prod" value={namespace} onChange={e => setNamespace(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Status</span></div>
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 13 }}>
              Not connected
            </div>
            <div style={{ borderTop: '1px solid var(--surface2)', paddingTop: 16, marginTop: 8 }}>
              <div className="card-title" style={{ marginBottom: 12, fontSize: 13 }}>Metrics</div>
              {[
                { label: 'Total vectors', value: '—' },
                { label: 'Dimensions',    value: '—' },
                { label: 'Index size',    value: '—' },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--surface2)', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--muted)' }}>{m.label}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
