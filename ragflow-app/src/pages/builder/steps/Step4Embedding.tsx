/**
 * Step 4 – Embedding provider → environment → config → model.
 *
 * Flow:
 *   1. Fetch providers from /api/v1/embeddings/providers
 *   2. User selects a provider
 *   3. Fetch all configs from /api/v1/embeddings/configs (filter by provider_slug)
 *   4. User selects environment (dev/qa/perf/prod) – further filters the config list
 *   5. User selects a config from the dropdown
 *   6. Fetch models via POST /api/v1/embeddings/configs/{id}/models
 *   7. User selects a model
 */
import React, { useEffect, useState } from 'react';
import type { PipelineFormData, PipelineEnv } from '../../../types';
import { getProviders, getConfigs, getModels, type EmbeddingConfig, type EmbeddingModel, type EmbeddingProvider } from '../../../api/embeddings';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

const SLUG_ICON: Record<string, string> = { openai: '🤖', ollama: '🦙', gemini: '✨', cohere: '🌊', voyage: '🚀' };
const ENVS: PipelineEnv[] = ['dev', 'qa', 'perf', 'prod'];

export const Step4Embedding: React.FC<Props> = ({ form, update }) => {
  const [providers, setProviders]     = useState<EmbeddingProvider[]>([]);
  const [allConfigs, setAllConfigs]   = useState<EmbeddingConfig[]>([]);
  const [models, setModels]           = useState<EmbeddingModel[]>([]);
  const [loadingP, setLoadingP]       = useState(true);
  const [loadingM, setLoadingM]       = useState(false);
  const [error, setError]             = useState('');

  // Load providers + configs on mount
  useEffect(() => {
    setLoadingP(true);
    Promise.all([getProviders(), getConfigs()])
      .then(([p, c]) => { setProviders(p.items); setAllConfigs(c.items); })
      .catch(e => setError(e.message))
      .finally(() => setLoadingP(false));
  }, []);

  // Fetch models when a config is selected
  useEffect(() => {
    if (!form.embeddingConfigId) { setModels([]); return; }
    setLoadingM(true);
    getModels(form.embeddingConfigId)
      .then(r => setModels(r.items ?? []))
      .catch(() => setModels([]))
      .finally(() => setLoadingM(false));
  }, [form.embeddingConfigId]);

  function selectProvider(slug: string) {
    update({ embeddingProviderSlug: slug, embeddingConfigEnv: '', embeddingConfigId: '', embeddingModel: '' });
    setModels([]);
  }

  function selectEnv(env: PipelineEnv) {
    update({ embeddingConfigEnv: env, embeddingConfigId: '', embeddingModel: '' });
    setModels([]);
  }

  // Configs filtered by selected provider + env
  const filteredByProvider = allConfigs.filter(c => c.provider_slug === form.embeddingProviderSlug);
  const filteredByEnv = form.embeddingConfigEnv
    ? filteredByProvider.filter(c => c.environment === form.embeddingConfigEnv)
    : filteredByProvider;

  const selectedConfig = allConfigs.find(c => c.id === form.embeddingConfigId);

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="section-title">Embedding Model</div>
      <div className="section-sub">Select a provider, then pick a saved configuration and model.</div>

      {loadingP && <div className="vs-loading">Loading providers…</div>}
      {error    && <p className="form-error">{error}</p>}

      {/* Provider cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {providers.map(p => (
          <div
            key={p.slug}
            className={`provider-card${form.embeddingProviderSlug === p.slug ? ' selected' : ''}`}
            onClick={() => selectProvider(p.slug)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && selectProvider(p.slug)}
          >
            {form.embeddingProviderSlug === p.slug && <span className="provider-check">&#10003;</span>}
            <div className="provider-card-logo">{SLUG_ICON[p.slug] ?? '🔌'}</div>
            <div className="provider-card-name">{p.display_name}</div>
            <div className="provider-card-desc">{p.description}</div>
          </div>
        ))}
      </div>

      {form.embeddingProviderSlug && (
        <>
          {/* Environment filter */}
          <div className="form-group">
            <label className="form-label">Configuration Environment</label>
            <div className="step1-env-grid">
              {ENVS.map(env => (
                <button
                  key={env}
                  type="button"
                  className={`step1-env-btn${form.embeddingConfigEnv === env ? ' selected' : ''}`}
                  onClick={() => selectEnv(env)}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* Config dropdown */}
          {form.embeddingConfigEnv && (
            <div className="form-group">
              <label className="form-label">Saved Configuration</label>
              {filteredByEnv.length === 0 ? (
                <div className="emb-no-configs">
                  No {form.embeddingProviderSlug} configs for <strong>{form.embeddingConfigEnv}</strong>.{' '}
                  Go to <em>Embedding Models</em> to add one.
                </div>
              ) : (
                <select
                  className="form-input"
                  value={form.embeddingConfigId}
                  onChange={e => update({ embeddingConfigId: e.target.value, embeddingModel: '' })}
                >
                  <option value="">— Select a config —</option>
                  {filteredByEnv.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
              {selectedConfig && (
                <span className="form-sublabel">
                  Config ID: <code>{selectedConfig.id.slice(0, 8)}…</code>
                </span>
              )}
            </div>
          )}

          {/* Model selection */}
          {form.embeddingConfigId && (
            <div className="form-group">
              <label className="form-label">Model</label>
              {loadingM ? (
                <div className="vs-loading">Fetching models…</div>
              ) : models.length === 0 ? (
                <div className="emb-no-configs">No models available for this config.</div>
              ) : (
                <select
                  className="form-input"
                  value={form.embeddingModel}
                  onChange={e => update({ embeddingModel: e.target.value })}
                >
                  <option value="">— Select a model —</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.display_name ?? m.id}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

