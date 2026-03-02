/**
 * PipelineBuilder – 7-step wizard for creating OR editing a RAG pipeline.
 *
 * Create mode: /pipelines/new
 *   Step 1 → Continue: PUT /api/v1/pipelines  (creates draft, gets pipeline_id)
 *
 * Edit mode: /pipelines/:id/edit
 *   Loads existing pipeline data on mount, all steps POST to existing pipeline_id
 *
 * Steps 2-6 → Continue: POST /api/v1/pipelines/{id}
 * Step 7 → Confirm: POST /api/v1/pipelines/{id}/confirm
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Step1Name }        from './steps/Step1Name';
import { Step2Documents }   from './steps/Step2Documents';
import { Step3Chunking }    from './steps/Step3Chunking';
import { Step4Embedding }   from './steps/Step4Embedding';
import { Step5VectorStore } from './steps/Step5VectorStore';
import { Step6Testing }     from './steps/Step6Testing';
import { Step7Review }      from './steps/Step7Review';
import {
  createPipelineDraft,
  updatePipelineDraft,
  confirmPipeline,
  type PipelineRead,
} from '../../api/pipelinesApi';
import type { PipelineFormData } from '../../types';

const STEPS = ['Name & Schedule', 'Documents', 'Chunking', 'Embedding', 'Vector Store', 'Testing', 'Review'];

const DEFAULT: PipelineFormData = {
  name: '', description: '', tags: [],
  environment: 'dev', frequency: '', scheduled_time: '', start_date: '',
  docSourceType: '', docSourceConfig: {}, documents: [],
  chunkingStrategyId: null, chunkingStrategySlug: '', chunkSize: 512, chunkOverlap: 64, customSeparators: [],
  embeddingProviderSlug: '', embeddingConfigEnv: '', embeddingConfigId: '', embeddingModel: '',
  vectorDbTypeSlug: '', vectorDbConnectionId: '',
  testQuery: '', topK: 5, similarityThreshold: 0.7,
  _pipelineId: null,
};

/** Build the API body from form data for each step */
function buildStepBody(step: number, form: PipelineFormData): Record<string, unknown> {
  switch (step) {
    case 1: return {
      document_source: form.docSourceType
        ? { type: form.docSourceType, config: form.docSourceConfig }
        : null,
    };
    case 2: return {
      chunking: form.chunkingStrategyId != null ? {
        strategy_id: form.chunkingStrategyId,
        chunk_size: form.chunkSize,
        chunk_overlap: form.chunkOverlap,
      } : null,
    };
    case 3: return {
      embedding: form.embeddingConfigId && form.embeddingModel ? {
        embedding_config_id: form.embeddingConfigId,
        embedding_model: form.embeddingModel,
      } : null,
    };
    case 4: return {
      vector_store: form.vectorDbConnectionId ? {
        vector_db_config_id: form.vectorDbConnectionId,
      } : null,
    };
    case 5: return {};  // testing step – nothing to persist
    default: return {};
  }
}

/** Map a PipelineRead from the API into our local form shape */
function pipelineToForm(p: PipelineRead): PipelineFormData {
  return {
    name: p.name,
    description: p.description ?? '',
    tags: p.tags ?? [],
    environment: (p.environment as PipelineFormData['environment']) ?? 'dev',
    frequency: p.frequency ?? '',
    scheduled_time: p.scheduled_time ?? '',
    start_date: p.start_date ?? '',
    docSourceType: p.source_type ?? '',
    docSourceConfig: (p.source_config as Record<string, string>) ?? {},
    documents: [],
    chunkingStrategyId: p.chunking_strategy_id ?? null,
    chunkingStrategySlug: p.chunking_strategy_name ?? '',
    chunkSize: p.chunk_size ?? 512,
    chunkOverlap: p.chunk_overlap ?? 64,
    customSeparators: [],
    embeddingProviderSlug: '',
    embeddingConfigEnv: '',
    embeddingConfigId: p.embedding_config_id ?? '',
    embeddingModel: p.embedding_model ?? '',
    vectorDbTypeSlug: '',
    vectorDbConnectionId: p.vector_db_config_id ?? '',
    testQuery: '', topK: 5, similarityThreshold: 0.7,
    _pipelineId: p.id,
  };
}

export const PipelineBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id?: string }>();
  const isEditMode = Boolean(editId);

  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState<PipelineFormData>(DEFAULT);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);

  // Always-current ref so async handlers never read stale form values
  const formRef = useRef(form);
  const update = (patch: Partial<PipelineFormData>) =>
    setForm(f => { const next = { ...f, ...patch }; formRef.current = next; return next; });

  // In edit mode, fetch the existing pipeline and pre-populate the form
  useEffect(() => {
    if (!editId) return;
    const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';
    const token = localStorage.getItem('ragflow_token');
    fetch(`${BASE}/api/v1/pipelines/${editId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(r => r.json())
      .then((p: PipelineRead) => {
        const populated = pipelineToForm(p);
        setForm(populated);
        formRef.current = populated;
      })
      .catch(e => setError(`Failed to load pipeline: ${e.message}`))
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  const goToStep = (target: number) => { setError(''); setStep(target); };
  const back     = () => goToStep(Math.max(0, step - 1));

  async function handleContinue() {
    setError('');
    setSaving(true);
    const currentForm = formRef.current;   // always fresh
    try {
      if (step === 0 && !isEditMode) {
        // Create mode: Step 1 creates the draft
        const draft = await createPipelineDraft({
          name: currentForm.name,
          description: currentForm.description || null,
          tags: currentForm.tags,
          environment: currentForm.environment,
          frequency: currentForm.frequency || null,
          scheduled_time: currentForm.scheduled_time || null,
          start_date: currentForm.start_date || null,
        });
        update({ _pipelineId: draft.id });
      } else if (currentForm._pipelineId) {
        // Edit mode (all steps) or create mode (steps 2-6): update draft
        const body = buildStepBody(step, currentForm);
        if (Object.keys(body).length > 0) {
          await updatePipelineDraft(currentForm._pipelineId, body);
        }
      }
      setStep(s => Math.min(STEPS.length - 1, s + 1));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save step');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirm() {
    const currentForm = formRef.current;
    if (!currentForm._pipelineId) return;
    setError('');
    setSaving(true);
    try {
      await confirmPipeline(currentForm._pipelineId);
      navigate('/pipelines');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to confirm pipeline');
    } finally {
      setSaving(false);
    }
  }

  const isFinalStep = step === STEPS.length - 1;
  // The highest step the user has reached (allows clicking back on indicators)
  const [maxStep, setMaxStep] = useState(isEditMode ? STEPS.length - 1 : 0);
  React.useEffect(() => {
    if (step > maxStep) setMaxStep(step);
  }, [step]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Show loading spinner while fetching pipeline in edit mode
  if (loadingEdit) {
    return <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>Loading pipeline…</div>;
  }

  return (
    <div className="wizard">
      {/* ── Step indicators ── */}
      <div className="wizard-steps">
        {STEPS.map((label, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'pending';
          const clickable = i < step || i <= maxStep;
          return (
            <React.Fragment key={label}>
              <div
                className={`step-item ${state}${clickable ? ' step-clickable' : ''}`}
                onClick={() => clickable && goToStep(i)}
                title={clickable ? `Go to: ${label}` : undefined}
              >
                <div className="step-num">{i < step ? '✓' : i + 1}</div>
                <div className="step-label">{label}</div>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Step content ── */}
      <div className="wizard-content">
        {step === 0 && <Step1Name        form={form} update={update} />}
        {step === 1 && <Step2Documents   form={form} update={update} />}
        {step === 2 && <Step3Chunking    form={form} update={update} />}
        {step === 3 && <Step4Embedding   form={form} update={update} />}
        {step === 4 && <Step5VectorStore form={form} update={update} />}
        {step === 5 && <Step6Testing     form={form} update={update} />}
        {step === 6 && <Step7Review      form={form} onConfirm={handleConfirm} confirming={saving} goToStep={goToStep} />}
      </div>

      {error && <div className="wizard-error">{error}</div>}

      {/* ── Footer nav (hidden on Review page – it has its own Confirm button) ── */}
      {!isFinalStep && (
        <div className="wizard-footer">
          <Button variant="ghost" onClick={step === 0 ? () => navigate('/pipelines') : back}>
            {step === 0 ? 'Cancel' : '← Back'}
          </Button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
              Step {step + 1} of {STEPS.length}
            </span>
            <Button onClick={handleContinue} disabled={saving || !form.name}>
              {saving ? 'Saving…' : 'Continue →'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

