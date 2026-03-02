/**
 * Step 5 – Vector Store: supported DB types → configured connections.
 *
 * Flow:
 *   1. Fetch DB types from GET /api/v1/vector-dbs/supported
 *   2. Fetch all connections from GET /api/v1/vector-dbs/connections
 *   3. User selects a DB type → filter connections by type_slug
 *   4. User selects a connection (the vector_db_config_id to persist)
 */
import React, { useEffect, useState } from 'react';
import type { PipelineFormData } from '../../../types';
import { getSupportedDbs, getConnections, type VectorDbConnection, type VectorDbType } from '../../../api/vectorDbs';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

const SLUG_ABBR: Record<string, string> = { qdrant: 'QDR', pinecone: 'PNE', milvus: 'MLV', pgvector: 'PG', weaviate: 'WVT', redis: 'RDS' };

export const Step5VectorStore: React.FC<Props> = ({ form, update }) => {
  const [dbTypes, setDbTypes]         = useState<VectorDbType[]>([]);
  const [allConns, setAllConns]       = useState<VectorDbConnection[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([getSupportedDbs(), getConnections()])
      .then(([dbs, conns]) => { setDbTypes(dbs.items); setAllConns(conns.items); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function selectType(slug: string) {
    update({ vectorDbTypeSlug: slug, vectorDbConnectionId: '' });
  }

  const filteredConns: VectorDbConnection[] = form.vectorDbTypeSlug
    ? allConns.filter(c => c.type_slug === form.vectorDbTypeSlug)
    : [];

  const selectedConn = allConns.find(c => c.id === form.vectorDbConnectionId);

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="section-title">Vector Store</div>
      <div className="section-sub">Select a vector database type, then pick a saved connection.</div>

      {loading && <div className="vs-loading">Loading…</div>}
      {error   && <p className="form-error">{error}</p>}

      {/* DB type cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {dbTypes.map(db => (
          <div
            key={db.slug}
            className={`provider-card${form.vectorDbTypeSlug === db.slug ? ' selected' : ''}`}
            onClick={() => selectType(db.slug)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && selectType(db.slug)}
          >
            {form.vectorDbTypeSlug === db.slug && <span className="provider-check">&#10003;</span>}
            <div className="provider-card-logo" style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>
              {SLUG_ABBR[db.slug] ?? db.slug.slice(0, 3).toUpperCase()}
            </div>
            <div className="provider-card-name">{db.display_name}</div>
            <div className="provider-card-desc">{db.description}</div>
          </div>
        ))}
      </div>

      {/* Connection dropdown */}
      {form.vectorDbTypeSlug && (
        <div className="form-group">
          <label className="form-label">Saved Connection</label>
          {filteredConns.length === 0 ? (
            <div className="emb-no-configs">
              No connections for this database type. Go to <em>Vector Stores</em> to add one.
            </div>
          ) : (
            <select
              className="form-input"
              value={form.vectorDbConnectionId}
              onChange={e => update({ vectorDbConnectionId: e.target.value })}
            >
              <option value="">— Select a connection —</option>
              {filteredConns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.environment})
                </option>
              ))}
            </select>
          )}
          {selectedConn && (
            <span className="form-sublabel">
              Connection ID: <code>{selectedConn.id.slice(0, 8)}…</code>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

