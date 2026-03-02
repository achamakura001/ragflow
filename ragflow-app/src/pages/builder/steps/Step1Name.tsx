/**
 * Step 1 – Name, description, tags, environment, schedule.
 * On Continue, PipelineBuilder calls PUT /api/v1/pipelines to create the draft.
 */
import React from 'react';
import type { PipelineFormData, PipelineEnv, PipelineFrequency } from '../../../types';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

const ENVS: PipelineEnv[]       = ['dev', 'qa', 'perf', 'prod'];
const FREQS: PipelineFrequency[] = ['daily', 'weekly', 'monthly'];

export const Step1Name: React.FC<Props> = ({ form, update }) => (
  <div style={{ maxWidth: 600 }}>
    <div className="section-title">Name &amp; Schedule</div>
    <div className="section-sub">Give your pipeline a name and configure when it should run.</div>

    {/* Name */}
    <div className="form-group">
      <label className="form-label">
        Pipeline Name <span className="field-required">*</span>
      </label>
      <input
        className="form-input"
        placeholder="e.g. Customer Support Bot"
        value={form.name}
        onChange={e => update({ name: e.target.value })}
        required
      />
    </div>

    {/* Description */}
    <div className="form-group">
      <label className="form-label">Description</label>
      <textarea
        className="form-textarea"
        placeholder="What will this pipeline be used for?"
        value={form.description}
        onChange={e => update({ description: e.target.value })}
      />
    </div>

    {/* Tags */}
    <div className="form-group">
      <label className="form-label">Tags</label>
      <input
        className="form-input"
        placeholder="e.g. support, production, v2 (comma-separated)"
        value={form.tags.join(', ')}
        onChange={e => update({ tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
      />
      <span className="form-sublabel">Tags help you filter and organise pipelines.</span>
    </div>

    {/* Environment */}
    <div className="form-group">
      <label className="form-label">Environment</label>
      <div className="step1-env-grid">
        {ENVS.map(env => (
          <button
            key={env}
            type="button"
            className={`step1-env-btn${form.environment === env ? ' selected' : ''}`}
            onClick={() => update({ environment: env })}
          >
            {env}
          </button>
        ))}
      </div>
    </div>

    {/* Frequency */}
    <div className="form-group">
      <label className="form-label">Run Frequency</label>
      <select
        className="form-input"
        value={form.frequency}
        onChange={e => update({ frequency: e.target.value as PipelineFrequency | '' })}
      >
        <option value="">One-time / Manual</option>
        {FREQS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
      </select>
    </div>

    {/* Schedule – only show when a frequency is chosen */}
    {form.frequency && (
      <div className="step1-schedule-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Time of Day (local)</label>
          <input
            type="time"
            className="form-input"
            value={form.scheduled_time}
            onChange={e => update({ scheduled_time: e.target.value })}
          />
          <span className="form-sublabel">Your local timezone</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-input"
            value={form.start_date}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => update({ start_date: e.target.value })}
          />
        </div>
      </div>
    )}
  </div>
);

