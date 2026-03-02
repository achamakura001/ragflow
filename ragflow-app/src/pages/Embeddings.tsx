/**
 * Embeddings – view and configure embedding model providers.
 *
 * Layout:
 *   Left  – provider card grid (fetched from API)
 *   Right – (after selecting a provider)
 *     1. Existing configs list for that provider (edit inline)
 *     2. New / Edit config form (dynamic fields from property_schema, per-env)
 *     3. Test-connection result banner
 *     4. Available models (fetched after test)
 */
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Topbar } from '../components/layout/Topbar';
import {
  getProviders,
  getConfigs,
  createConfig,
  updateConfig,
  testConfig,
  getModels,
  type EmbeddingConfig,
  type EmbeddingEnv,
  type EmbeddingModel,
  type EmbeddingProvider,
  type PropertyDefinition,
} from '../api/embeddings';

// ── Provider icon abbr ────────────────────────────────────────────────────────
const SLUG_ICON: Record<string, string> = {
  openai:  '🤖',
  ollama:  '🦙',
  gemini:  '✨',
  cohere:  '🌊',
  voyage:  '🚀',
};

// ── Env badge colours ─────────────────────────────────────────────────────────
const ENV_BADGE: Record<EmbeddingEnv, string> = {
  dev:  'badge-blue',
  qa:   'badge-gray',
  perf: 'badge-gray',
  prod: 'badge-red',
};

// ── Dynamic property form (shared with VectorStores) ─────────────────────────
interface DynFormProps {
  schema: PropertyDefinition[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

const DynamicPropertyForm: React.FC<DynFormProps> = ({ schema, values, onChange }) => (
  <>
    {schema.map((field) => {
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
            type={field.type === 'password' ? 'password' : field.type === 'integer' ? 'number' : 'text'}
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

// ── Form field reducer ────────────────────────────────────────────────────────
type FormAction =
  | { type: 'set'; name: string; value: string }
  | { type: 'reset'; defaults: Record<string, string> };

function formReducer(state: Record<string, string>, action: FormAction): Record<string, string> {
  if (action.type === 'set') return { ...state, [action.name]: action.value };
  if (action.type === 'reset') return { ...action.defaults };
  return state;
}

function schemaDefaults(schema: PropertyDefinition[]): Record<string, string> {
  return Object.fromEntries(
    schema.map((f) => [f.name, f.default != null ? String(f.default) : '']),
  );
}

// ── Test result banner ────────────────────────────────────────────────────────
interface TestBannerProps { success: boolean; message?: string; latency_ms?: number }
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

// ── Config card (list row with edit button) ───────────────────────────────────
interface ConfigCardProps {
  config: EmbeddingConfig;
  onEdit: (c: EmbeddingConfig) => void;
}
const ConfigCard: React.FC<ConfigCardProps> = ({ config, onEdit }) => (
  <div className="conn-card">
    <div className="conn-card-header">
      <span className="conn-card-name">{config.name}</span>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className={`badge ${ENV_BADGE[config.environment] ?? 'badge-gray'}`}>
          {config.environment}
        </span>
        <button className="emb-edit-btn" onClick={() => onEdit(config)} title="Edit">
          ✎ Edit
        </button>
      </div>
    </div>
    <div className="conn-card-meta">
      <span>ID: <code>{config.id.slice(0, 8)}…</code></span>
      <span>Updated: {new Date(config.updated_at).toLocaleDateString()}</span>
    </div>
    {Object.entries(config.properties).length > 0 && (
      <div className="conn-card-props">
        {Object.entries(config.properties).map(([k, v]) => (
          <div key={k} className="conn-prop-row">
            <span className="conn-prop-key">{k}</span>
            <span className="conn-prop-val">{String(v)}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── Models panel ──────────────────────────────────────────────────────────────
const ModelsPanel: React.FC<{ models: EmbeddingModel[] }> = ({ models }) => (
  <div className="card" style={{ marginTop: 20 }}>
    <div className="card-header">
      <span className="card-title">Available Models</span>
      <span className="badge badge-gray">{models.length}</span>
    </div>
    {models.length === 0 ? (
      <div className="vs-empty-conns">No models returned by provider.</div>
    ) : (
      <div className="emb-models-grid">
        {models.map((m) => (
          <div key={m.id} className="emb-model-chip">
            <div className="emb-model-id">{m.id}</div>
            {m.display_name && m.display_name !== m.id && (
              <div className="emb-model-name">{m.display_name}</div>
            )}
            {m.description && <div className="emb-model-desc">{m.description}</div>}
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export const Embeddings: React.FC = () => {
  // Providers
  const [providers, setProviders] = useState<EmbeddingProvider[]>([]);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [providersError, setProvidersError] = useState('');

  // Selected provider
  const [selectedProvider, setSelectedProvider] = useState<EmbeddingProvider | null>(null);

  // All configs (client-filtered by provider_slug)
  const [allConfigs, setAllConfigs] = useState<EmbeddingConfig[]>([]);
  const [confsLoading, setConfsLoading] = useState(false);

  // Form state – used for both create and edit
  const [editingConfig, setEditingConfig] = useState<EmbeddingConfig | null>(null);
  const [configName, setConfigName] = useState('');
  const [environment, setEnvironment] = useState<EmbeddingEnv>('dev');
  const [fieldValues, dispatch] = useReducer(formReducer, {});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Post-save state
  const [savedConfigId, setSavedConfigId] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestBannerProps | null>(null);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [models, setModels] = useState<EmbeddingModel[] | null>(null);

  // Load providers on mount
  useEffect(() => {
    getProviders()
      .then((r) => setProviders(r.items))
      .catch((e) => setProvidersError(e.message))
      .finally(() => setProvidersLoading(false));
  }, []);

  const loadConfigs = useCallback(() => {
    setConfsLoading(true);
    getConfigs()
      .then((r) => setAllConfigs(r.items))
      .catch(() => setAllConfigs([]))
      .finally(() => setConfsLoading(false));
  }, []);

  function resetForm(schema: PropertyDefinition[]) {
    setConfigName('');
    setEnvironment('dev');
    dispatch({ type: 'reset', defaults: schemaDefaults(schema) });
    setSaveError('');
    setSavedConfigId(null);
    setTestResult(null);
    setModels(null);
    setEditingConfig(null);
  }

  function selectProvider(p: EmbeddingProvider) {
    setSelectedProvider(p);
    resetForm(p.property_schema);
    loadConfigs();
  }

  function startEdit(config: EmbeddingConfig) {
    if (!selectedProvider) return;
    setEditingConfig(config);
    setConfigName(config.name);
    setEnvironment(config.environment);
    // Populate saved property values (secret fields will show masked placeholder)
    const vals = schemaDefaults(selectedProvider.property_schema);
    for (const [k, v] of Object.entries(config.properties)) {
      vals[k] = String(v);
    }
    dispatch({ type: 'reset', defaults: vals });
    setSaveError('');
    setSavedConfigId(config.id);
    setTestResult(null);
    setModels(null);
    // Scroll the form into view
    document.getElementById('emb-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  function buildProperties(): Record<string, unknown> {
    if (!selectedProvider) return {};
    const props: Record<string, unknown> = {};
    for (const field of selectedProvider.property_schema) {
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
    if (!selectedProvider) return;
    setSaving(true);
    setSaveError('');
    setTestResult(null);
    setModels(null);

    try {
      let saved: EmbeddingConfig;
      if (editingConfig) {
        saved = await updateConfig(editingConfig.id, {
          name: configName,
          environment,
          properties: buildProperties(),
        });
      } else {
        saved = await createConfig({
          provider_slug: selectedProvider.slug,
          name: configName,
          environment,
          properties: buildProperties(),
        });
      }
      setSavedConfigId(saved.id);
      loadConfigs();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save config');
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!savedConfigId) return;
    setTesting(true);
    setTestResult(null);
    setModels(null);
    try {
      const result = await testConfig(savedConfigId);
      setTestResult({ success: result.success ?? true, message: result.message, latency_ms: result.latency_ms });
    } catch (err: unknown) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Test failed' });
    } finally {
      setTesting(false);
    }
  }

  async function handleFetchModels() {
    if (!savedConfigId) return;
    setFetchingModels(true);
    try {
      const result = await getModels(savedConfigId);
      setModels(result.items ?? []);
    } catch (err: unknown) {
      setModels([]);
    } finally {
      setFetchingModels(false);
    }
  }

  const providerConfigs = allConfigs.filter((c) => c.provider_slug === selectedProvider?.slug);

  return (
    <>
      <Topbar title="Embedding Models" />
      <div className="content">
        <div className="vs-layout">

          {/* ── Provider selector ── */}
          <div className="vs-left">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Providers</span>
              </div>
              {providersLoading && <div className="vs-loading">Loading providers…</div>}
              {providersError && <p className="form-error">{providersError}</p>}
              <div className="vs-type-grid">
                {providers.map((p) => (
                  <div
                    key={p.slug}
                    className={`provider-card${selectedProvider?.slug === p.slug ? ' selected' : ''}`}
                    onClick={() => selectProvider(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && selectProvider(p)}
                  >
                    {selectedProvider?.slug === p.slug && (
                      <span className="provider-check">&#10003;</span>
                    )}
                    <div className="provider-card-logo">
                      {SLUG_ICON[p.slug] ?? '🔌'}
                    </div>
                    <div className="provider-card-name">{p.display_name}</div>
                    <div className="provider-card-desc">{p.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="vs-right">
            {!selectedProvider ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔌</div>
                <div className="empty-state-title">Select a provider</div>
                <div className="empty-state-desc">
                  Choose an embedding provider from the left to view configurations and add a new one.
                </div>
              </div>
            ) : (
              <>
                {/* ── Existing configs ── */}
                <div className="card" style={{ marginBottom: 20 }}>
                  <div className="card-header">
                    <span className="card-title">
                      {selectedProvider.display_name} Configurations
                    </span>
                    <span className="badge badge-gray">
                      {confsLoading ? '…' : providerConfigs.length}
                    </span>
                  </div>
                  {confsLoading ? (
                    <div className="vs-loading">Loading…</div>
                  ) : providerConfigs.length === 0 ? (
                    <div className="vs-empty-conns">No configs yet — create one below.</div>
                  ) : (
                    <div className="conn-list">
                      {providerConfigs.map((c) => (
                        <ConfigCard key={c.id} config={c} onEdit={startEdit} />
                      ))}
                    </div>
                  )}
                </div>

                {/* ── New / Edit config form ── */}
                <div className="card" id="emb-form">
                  <div className="card-header">
                    <span className="card-title">
                      {editingConfig
                        ? `Edit "${editingConfig.name}"`
                        : `New ${selectedProvider.display_name} Config`}
                    </span>
                    {editingConfig && (
                      <button
                        className="emb-edit-btn"
                        onClick={() => resetForm(selectedProvider.property_schema)}
                      >
                        + New Config
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSave}>
                    {/* Meta */}
                    <div className="form-group">
                      <label className="form-label">
                        Config Name <span className="field-required">*</span>
                      </label>
                      <input
                        className="form-input"
                        placeholder={`My ${selectedProvider.display_name} – Dev`}
                        value={configName}
                        onChange={(e) => setConfigName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Environment</label>
                      <select
                        className="form-input"
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value as EmbeddingEnv)}
                      >
                        {(['dev', 'qa', 'perf', 'prod'] as EmbeddingEnv[]).map((env) => (
                          <option key={env} value={env}>{env}</option>
                        ))}
                      </select>
                    </div>

                    {/* Dynamic fields */}
                    <div className="vs-section-label">Provider Settings</div>
                    <DynamicPropertyForm
                      schema={selectedProvider.property_schema}
                      values={fieldValues}
                      onChange={(name, value) => dispatch({ type: 'set', name, value })}
                    />

                    {saveError && <p className="form-error">{saveError}</p>}

                    <div className="vs-form-actions">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                      >
                        {saving ? 'Saving…' : editingConfig ? 'Update Config' : 'Save Config'}
                      </button>

                      {savedConfigId && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleTest}
                          disabled={testing}
                        >
                          {testing ? 'Testing…' : 'Test Config'}
                        </button>
                      )}

                      {savedConfigId && testResult?.success && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleFetchModels}
                          disabled={fetchingModels}
                        >
                          {fetchingModels ? 'Fetching…' : 'Load Models'}
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

                {/* ── Models panel (shown after load) ── */}
                {models !== null && <ModelsPanel models={models} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
