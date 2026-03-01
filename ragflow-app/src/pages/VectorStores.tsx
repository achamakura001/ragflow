/**
 * VectorStores – manage vector database connections.
 *
 * Layout:
 *   Left panel  – grid of supported DB type cards (fetched from API)
 *   Right panel – (after selecting a type)
 *     1. Existing connections for that type
 *     2. "New Connection" form whose fields are driven by the type's property_schema
 *     3. Test-connection result after save
 */
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Topbar } from '../components/layout/Topbar';
import {
  getSupportedDbs,
  getConnections,
  createConnection,
  testConnection,
  type PropertyDefinition,
  type VectorDbConnection,
  type VectorDbEnv,
  type VectorDbType,
} from '../api/vectorDbs';

// ── DB-type icon abbreviations ───────────────────────────────────────────────
const SLUG_ABBR: Record<string, string> = {
  qdrant:   'QDR',
  pinecone: 'PNE',
  milvus:   'MLV',
  pgvector: 'PG',
  weaviate: 'WVT',
  redis:    'RDS',
};

// ── Dynamic property form ────────────────────────────────────────────────────

interface DynFormProps {
  schema: PropertyDefinition[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const DynamicPropertyForm: React.FC<DynFormProps> = ({ schema, values, onChange }) => (
  <>
    {schema.map((field) => {
      const inputType =
        field.type === 'password' ? 'password'
        : field.type === 'integer' ? 'number'
        : 'text';

      if (field.type === 'boolean') {
        return (
          <div key={field.name} className="form-group">
            <label className="form-label" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={values[field.name] === 'true'}
                onChange={(e) => onChange(field.name, e.target.checked ? 'true' : 'false')}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
              />
              {field.label}
              {field.required && <span className="field-required">*</span>}
            </label>
            {field.description && <div className="field-hint">{field.description}</div>}
          </div>
        );
      }

      return (
        <div key={field.name} className="form-group">
          <label className="form-label">
            {field.label}
            {field.required && <span className="field-required"> *</span>}
          </label>
          {field.description && <div className="field-hint">{field.description}</div>}
          <input
            type={inputType}
            className="form-input"
            placeholder={field.placeholder ?? ''}
            value={values[field.name] ?? ''}
            required={field.required}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        </div>
      );
    })}
  </>
);

// ── Connection card ──────────────────────────────────────────────────────────

const ConnectionCard: React.FC<{ conn: VectorDbConnection }> = ({ conn }) => (
  <div className="conn-card">
    <div className="conn-card-header">
      <span className="conn-card-name">{conn.name}</span>
      <span className={`badge badge-${conn.environment === 'prod' ? 'red' : conn.environment === 'dev' ? 'blue' : 'gray'}`}>
        {conn.environment}
      </span>
    </div>
    <div className="conn-card-meta">
      <span>ID: <code>{conn.id.slice(0, 8)}…</code></span>
      <span>Created: {new Date(conn.created_at).toLocaleDateString()}</span>
    </div>
    {Object.entries(conn.properties).length > 0 && (
      <div className="conn-card-props">
        {Object.entries(conn.properties).map(([k, v]) => (
          <div key={k} className="conn-prop-row">
            <span className="conn-prop-key">{k}</span>
            <span className="conn-prop-val">{String(v)}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── Test result banner ───────────────────────────────────────────────────────

interface TestBannerProps {
  success: boolean;
  message?: string;
  latency_ms?: number;
}
const TestBanner: React.FC<TestBannerProps> = ({ success, message, latency_ms }) => (
  <div className={`test-banner ${success ? 'test-banner-ok' : 'test-banner-fail'}`}>
    <span className="test-banner-icon">{success ? '✓' : '✗'}</span>
    <div>
      <div className="test-banner-title">{success ? 'Connection successful' : 'Connection failed'}</div>
      {message && <div className="test-banner-msg">{message}</div>}
      {latency_ms != null && <div className="test-banner-msg">Latency: {latency_ms} ms</div>}
    </div>
  </div>
);

// ── Reducer for form field values ────────────────────────────────────────────

type FormAction =
  | { type: 'set'; name: string; value: string }
  | { type: 'reset'; defaults: Record<string, string> };

function formReducer(
  state: Record<string, string>,
  action: FormAction,
): Record<string, string> {
  if (action.type === 'set') return { ...state, [action.name]: action.value };
  if (action.type === 'reset') return { ...action.defaults };
  return state;
}

function schemaDefaults(schema: PropertyDefinition[]): Record<string, string> {
  return Object.fromEntries(
    schema.map((f) => [f.name, f.default != null ? String(f.default) : '']),
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export const VectorStores: React.FC = () => {
  // Supported DB types
  const [dbTypes, setDbTypes] = useState<VectorDbType[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typesError, setTypesError] = useState('');

  // Selected DB type
  const [selectedType, setSelectedType] = useState<VectorDbType | null>(null);

  // All connections (filtered client-side by type_slug)
  const [allConnections, setAllConnections] = useState<VectorDbConnection[]>([]);
  const [connsLoading, setConnsLoading] = useState(false);

  // New-connection form
  const [connName, setConnName] = useState('');
  const [environment, setEnvironment] = useState<VectorDbEnv>('dev');
  const [fieldValues, dispatch] = useReducer(formReducer, {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Test connection
  const [newConnId, setNewConnId] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestBannerProps | null>(null);

  // Load supported types on mount
  useEffect(() => {
    setTypesLoading(true);
    getSupportedDbs()
      .then((r) => setDbTypes(r.items))
      .catch((e) => setTypesError(e.message))
      .finally(() => setTypesLoading(false));
  }, []);

  // Load all connections when a type is selected
  const loadConnections = useCallback(() => {
    setConnsLoading(true);
    getConnections()
      .then((r) => setAllConnections(r.items))
      .catch(() => setAllConnections([]))
      .finally(() => setConnsLoading(false));
  }, []);

  function selectType(dbType: VectorDbType) {
    setSelectedType(dbType);
    setConnName('');
    setEnvironment('dev');
    dispatch({ type: 'reset', defaults: schemaDefaults(dbType.property_schema) });
    setSaveError('');
    setNewConnId(null);
    setTestResult(null);
    loadConnections();
  }

  // Connections for the currently selected type
  const typeConnections = allConnections.filter(
    (c) => c.type_slug === selectedType?.slug,
  );

  // Build properties object from field values, coercing types
  function buildProperties(): Record<string, unknown> {
    if (!selectedType) return {};
    const props: Record<string, unknown> = {};
    for (const field of selectedType.property_schema) {
      const raw = fieldValues[field.name];
      if (raw === '' || raw == null) continue;
      if (field.type === 'integer') props[field.name] = parseInt(raw, 10);
      else if (field.type === 'boolean') props[field.name] = raw === 'true';
      else props[field.name] = raw;
    }
    return props;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedType) return;
    setSaving(true);
    setSaveError('');
    setTestResult(null);
    setNewConnId(null);
    try {
      const conn = await createConnection({
        type_slug: selectedType.slug,
        name: connName,
        environment,
        properties: buildProperties(),
      });
      setNewConnId(conn.id);
      loadConnections(); // refresh list
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save connection');
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!newConnId) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testConnection(newConnId);
      setTestResult({
        success: result.success ?? true,
        message: result.message,
        latency_ms: result.latency_ms,
      });
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Test failed',
      });
    } finally {
      setTesting(false);
    }
  }

  return (
    <>
      <Topbar title="Vector Stores" />
      <div className="content">
        <div className="vs-layout">

          {/* ── DB type selector ── */}
          <div className="vs-left">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Supported Databases</span>
              </div>

              {typesLoading && <div className="vs-loading">Loading…</div>}
              {typesError && <div className="form-error">{typesError}</div>}

              <div className="vs-type-grid">
                {dbTypes.map((db) => (
                  <div
                    key={db.slug}
                    className={`provider-card${selectedType?.slug === db.slug ? ' selected' : ''}`}
                    onClick={() => selectType(db)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && selectType(db)}
                  >
                    {selectedType?.slug === db.slug && (
                      <span className="provider-check">&#10003;</span>
                    )}
                    <div
                      className="provider-card-logo"
                      style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}
                    >
                      {SLUG_ABBR[db.slug] ?? db.slug.slice(0, 3).toUpperCase()}
                    </div>
                    <div className="provider-card-name">{db.display_name}</div>
                    <div className="provider-card-desc">{db.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="vs-right">
            {!selectedType ? (
              <div className="empty-state">
                <div className="empty-state-icon">🗄️</div>
                <div className="empty-state-title">Select a database type</div>
                <div className="empty-state-desc">
                  Choose a vector database from the left to view connections and add a new one.
                </div>
              </div>
            ) : (
              <>
                {/* Existing connections */}
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-header">
                    <span className="card-title">
                      {selectedType.display_name} Connections
                    </span>
                    <span className="badge badge-gray">
                      {connsLoading ? '…' : typeConnections.length}
                    </span>
                  </div>
                  {connsLoading ? (
                    <div className="vs-loading">Loading connections…</div>
                  ) : typeConnections.length === 0 ? (
                    <div className="vs-empty-conns">No connections yet — create one below.</div>
                  ) : (
                    <div className="conn-list">
                      {typeConnections.map((c) => (
                        <ConnectionCard key={c.id} conn={c} />
                      ))}
                    </div>
                  )}
                </div>

                {/* New connection form */}
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">
                      New {selectedType.display_name} Connection
                    </span>
                  </div>

                  <form onSubmit={handleSave}>
                    {/* Meta fields */}
                    <div className="form-group">
                      <label className="form-label">
                        Connection Name <span className="field-required">*</span>
                      </label>
                      <input
                        className="form-input"
                        placeholder={`My ${selectedType.display_name} – Prod`}
                        value={connName}
                        onChange={(e) => setConnName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Environment</label>
                      <select
                        className="form-input"
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value as VectorDbEnv)}
                      >
                        {(['dev', 'qa', 'perf', 'prod'] as VectorDbEnv[]).map((env) => (
                          <option key={env} value={env}>{env}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic property fields */}
                    <div className="vs-section-label">Connection Properties</div>
                    <DynamicPropertyForm
                      schema={selectedType.property_schema}
                      values={fieldValues}
                      onChange={(name, value) =>
                        dispatch({ type: 'set', name, value })
                      }
                    />

                    {saveError && <p className="form-error">{saveError}</p>}

                    <div className="vs-form-actions">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                      >
                        {saving ? 'Saving…' : 'Save Connection'}
                      </button>

                      {newConnId && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleTest}
                          disabled={testing}
                        >
                          {testing ? 'Testing…' : 'Test Connection'}
                        </button>
                      )}
                    </div>
                  </form>

                  {testResult && (
                    <div style={{ marginTop: 20 }}>
                      <TestBanner {...testResult} />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
