import React from 'react';
import type { PipelineFormData } from '../../../types';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

export const Step1Name: React.FC<Props> = ({ form, update }) => (
  <div style={{ maxWidth: 560 }}>
    <div className="section-title">Name Your Pipeline</div>
    <div className="section-sub">Give your pipeline a descriptive name and tags to help you find it later.</div>
    <div className="form-group">
      <label className="form-label">Pipeline Name <span style={{ color: 'var(--error)' }}>*</span></label>
      <input
        className="form-input"
        placeholder="e.g. Customer Support Bot"
        value={form.name}
        onChange={e => update({ name: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label className="form-label">Description</label>
      <textarea
        className="form-textarea"
        placeholder="What will this pipeline be used for?"
        value={form.description}
        onChange={e => update({ description: e.target.value })}
      />
    </div>
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
  </div>
);
