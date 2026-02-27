/**
 * PipelineBuilder - 7-step wizard for creating a new RAG pipeline.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button }  from '../../components/ui/Button';
import { Step1Name }         from './steps/Step1Name';
import { Step2Documents }    from './steps/Step2Documents';
import { Step3Chunking }     from './steps/Step3Chunking';
import { Step4Embedding }    from './steps/Step4Embedding';
import { Step5VectorStore }  from './steps/Step5VectorStore';
import { Step6Testing }      from './steps/Step6Testing';
import { Step7Review }       from './steps/Step7Review';
import { createPipeline }    from '../../api/pipelines';
import type { PipelineFormData } from '../../types';

const STEPS = [
  'Name', 'Documents', 'Chunking', 'Embedding', 'Vector Store', 'Testing', 'Review',
];

const DEFAULT: PipelineFormData = {
  name: '', description: '', tags: [],
  documents: [],
  chunkingStrategy: 'fixed',
  chunkSize: 512, chunkOverlap: 64, customSeparators: [],
  embeddingProvider: '', embeddingModel: '', embeddingApiKey: '',
  vectorStore: '', vectorStoreConfig: {},
  testQuery: '', topK: 5, similarityThreshold: 0.7,
};

export const PipelineBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState<PipelineFormData>(DEFAULT);
  const [saving, setSaving] = useState(false);

  const update = (patch: Partial<PipelineFormData>) => setForm(f => ({ ...f, ...patch }));
  const next   = () => setStep(s => Math.min(STEPS.length - 1, s + 1));
  const back   = () => setStep(s => Math.max(0, s - 1));

  const finish = async () => {
    setSaving(true);
    await createPipeline(form);
    setSaving(false);
    navigate('/pipelines');
  };

  const STEP_COMPONENTS = [
    <Step1Name        key={0} form={form} update={update} />,
    <Step2Documents   key={1} form={form} update={update} />,
    <Step3Chunking    key={2} form={form} update={update} />,
    <Step4Embedding   key={3} form={form} update={update} />,
    <Step5VectorStore key={4} form={form} update={update} />,
    <Step6Testing     key={5} form={form} update={update} />,
    <Step7Review      key={6} form={form} />,
  ];

  return (
    <div className="wizard">
      <div className="wizard-steps">
        {STEPS.map((label, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'pending';
          return (
            <React.Fragment key={label}>
              <div className={"step-item " + state}>
                <div className="step-num">{i < step ? '✓' : i + 1}</div>
                <div className="step-label">{label}</div>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="wizard-content">{STEP_COMPONENTS[step]}</div>

      <div className="wizard-footer">
        <Button variant="ghost" onClick={step === 0 ? () => navigate('/pipelines') : back}>
          {step === 0 ? 'Cancel' : '← Back'}
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Step {step + 1} of {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Continue →</Button>
          ) : (
            <Button onClick={finish} disabled={saving}>{saving ? 'Creating...' : 'Create Pipeline'}</Button>
          )}
        </div>
      </div>
    </div>
  );
};
