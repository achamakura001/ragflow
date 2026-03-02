/**
 * PipelineBuilder – 7-step wizard for creating a new RAG pipeline.
 *
 * Persistence strategy:
 *   Step 1 → Continue: PUT /api/v1/pipelines          (create draft, get pipeline_id)
 *   Steps 2-6 → Continue: POST /api/v1/pipelines/{id} (update draft)
 *   Step 7 → Confirm: POST /api/v1/pipelines/{id}/confirm
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '../../api/pipelinesApi';
import type { PipelineFormData } from '../../types';

const STEPS = ['Name & Schedule', 'Documents', 'Chunking', 'Embedding', 'Vector Store', 'Testing', 'Review'];

const DEFAULT: PipelineFormData = {
  name: '', description: '', tags: [],
  environment: 'dev', frequency: '', scheduled_time: '', start_date: '',
  documents: [],
  chunkingStrategyId: null, chunkingStrategySlug: '', chunkSize: 512, chunkOverlap: 64, customSeparators: [],
  embeddingProviderSlug: '', embeddingConfigEnv: '', embeddingConfigId: '', embeddingModel: '',
  vectorDbTypeSlug: '', vectorDbConnectionId: '',
  testQuery: '', topK: 5, similarityThreshold: 0.7,
  _pipelineId: null,
};

/** Build the API body from form data for steps 2-6 */
function buildStepBody(step: number, form: PipelineFormData): Record<string, unknown> {
  switch (step) {
    case 1: return {
      document_source: { type: 'local', config: { files: form.documents.map(d => d.name) } },
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

export const PipelineBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState<PipelineFormData>(DEFAULT);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const update = (patch: Partial<PipelineFormData>) => setForm(f => ({ ...f, ...patch }));

  const back = () => { setError(''); setStep(s => Math.max(0, s - 1)); };

  async function handleContinue() {
    setError('');
    setSaving(true);
    try {
      if (step === 0) {
        // Step 1: create draft
        const draft = await createPipelineDraft({
          name: form.name,
          description: form.description || null,
          tags: form.tags,
          environment: form.environment,
          frequency: form.frequency || null,
          scheduled_time: form.scheduled_time || null,
          start_date: form.start_date || null,
        });
        update({ _pipelineId: draft.id });
      } else if (form._pipelineId) {
        // Steps 1-5: update draft
        const body = buildStepBody(step, form);
        if (Object.keys(body).length > 0) {
          await updatePipelineDraft(form._pipelineId, body);
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
    if (!form._pipelineId) return;
    setError('');
    setSaving(true);
    try {
      await confirmPipeline(form._pipelineId);
      navigate('/pipelines');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to confirm pipeline');
    } finally {
      setSaving(false);
    }
  }

  const isFinalStep = step === STEPS.length - 1;

  return (
    <div className="wizard">
      <div className="wizard-steps">
        {STEPS.map((label, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'pending';
          return (
            <React.Fragment key={label}>
              <div className={`step-item ${state}`}>
                <div className="step-num">{i < step ? '✓' : i + 1}</div>
                <div className="step-label">{label}</div>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="wizard-content">
        {step === 0 && <Step1Name        form={form} update={update} />}
        {step === 1 && <Step2Documents   form={form} update={update} />}
        {step === 2 && <Step3Chunking    form={form} update={update} />}
        {step === 3 && <Step4Embedding   form={form} update={update} />}
        {step === 4 && <Step5VectorStore form={form} update={update} />}
        {step === 5 && <Step6Testing     form={form} update={update} />}
        {step === 6 && <Step7Review      form={form} onConfirm={handleConfirm} confirming={saving} />}
      </div>

      {error && <div className="wizard-error">{error}</div>}

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

