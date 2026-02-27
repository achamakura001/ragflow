import React from 'react';
import type { PipelineFormData } from '../../../types';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

export const Step2Documents: React.FC<Props> = ({ form, update }) => {
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).map(f => ({
      id: crypto.randomUUID(), name: f.name, size: f.size,
      type: f.type, uploadedAt: new Date().toISOString(), status: 'uploaded' as const,
    }));
    update({ documents: [...form.documents, ...files] });
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="section-title">Upload Documents</div>
      <div className="section-sub">Add the source documents for your pipeline. PDF, DOCX, TXT, and MD are supported.</div>
      <label style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        border: '2px dashed var(--border)', borderRadius: 12, padding: '40px 20px',
        cursor: 'pointer', color: 'var(--muted)', fontSize: 13, gap: 8,
        background: 'var(--surface)', transition: 'border-color 0.15s',
      }}>
        <span style={{ fontSize: 32 }}>&#128196;</span>
        <span style={{ fontWeight: 600 }}>Drop files here or click to upload</span>
        <span>PDF, DOCX, TXT, MD — up to 50 MB each</span>
        <input type="file" multiple accept=".pdf,.docx,.txt,.md" style={{ display: 'none' }} onChange={handleFiles} />
      </label>
      {form.documents.length > 0 && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {form.documents.map(d => (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, background: 'white', fontSize: 13 }}>
              <span>&#128196;</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{d.name}</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{(d.size / 1024).toFixed(0)} KB</span>
              <button style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                onClick={() => update({ documents: form.documents.filter(x => x.id !== d.id) })}>&times;</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
