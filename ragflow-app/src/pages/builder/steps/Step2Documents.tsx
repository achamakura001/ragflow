/**
 * Step 2 – Document Source.
 *
 * The API expects: { type: 'gcs' | 'azure' | 'local', config: { ...keys } }
 *
 * Recommended config keys per type:
 *   gcs   – bucket_name, prefix, service_account_json
 *   azure – account_name, container_name, account_key, connection_string
 *   local – path
 */
import React from 'react';
import type { PipelineFormData, DocumentSourceType } from '../../../types';

interface Props { form: PipelineFormData; update: (p: Partial<PipelineFormData>) => void; }

// ── Source type metadata ──────────────────────────────────────────────────────
interface SourceField { name: string; label: string; placeholder: string; secret?: boolean; multiline?: boolean }

const SOURCE_TYPES: {
  type: DocumentSourceType;
  icon: string;
  label: string;
  desc: string;
  fields: SourceField[];
}[] = [
  {
    type: 'gcs',
    icon: '☁️',
    label: 'Google Cloud Storage',
    desc: 'Read documents from a GCS bucket.',
    fields: [
      { name: 'bucket_name',          label: 'Bucket Name',          placeholder: 'my-rag-bucket' },
      { name: 'prefix',               label: 'Prefix / Folder',      placeholder: 'docs/prod/' },
      { name: 'service_account_json', label: 'Service Account JSON', placeholder: '{"type":"service_account",...}', secret: true, multiline: true },
    ],
  },
  {
    type: 'azure',
    icon: '🔷',
    label: 'Azure Blob Storage',
    desc: 'Read documents from an Azure Blob container.',
    fields: [
      { name: 'account_name',       label: 'Storage Account Name', placeholder: 'mystorageaccount' },
      { name: 'container_name',     label: 'Container Name',       placeholder: 'documents' },
      { name: 'account_key',        label: 'Account Key',          placeholder: '…==', secret: true },
      { name: 'connection_string',  label: 'Connection String (alt)', placeholder: 'DefaultEndpointsProtocol=https;…', secret: true },
    ],
  },
  {
    type: 'local',
    icon: '📁',
    label: 'Local / Upload',
    desc: 'Upload files directly or specify a server-local path.',
    fields: [
      { name: 'path', label: 'Server-side Path', placeholder: '/data/documents' },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export const Step2Documents: React.FC<Props> = ({ form, update }) => {
  const selected = SOURCE_TYPES.find(s => s.type === form.docSourceType) ?? null;

  function setType(type: DocumentSourceType) {
    update({ docSourceType: type, docSourceConfig: {}, documents: [] });
  }

  function setConfigField(name: string, value: string) {
    update({ docSourceConfig: { ...form.docSourceConfig, [name]: value } });
  }

  // Local file picker helper
  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).map(f => ({
      id: crypto.randomUUID(), name: f.name, size: f.size,
      type: f.type, uploadedAt: new Date().toISOString(), status: 'uploaded' as const,
    }));
    update({ documents: [...form.documents, ...files] });
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="section-title">Document Source</div>
      <div className="section-sub">Choose where your documents live — GCS bucket, Azure Blob Storage, or a local path / upload.</div>

      {/* Source type cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {SOURCE_TYPES.map(s => (
          <div
            key={s.type}
            className={`provider-card${form.docSourceType === s.type ? ' selected' : ''}`}
            onClick={() => setType(s.type)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setType(s.type)}
          >
            {form.docSourceType === s.type && <span className="provider-check">&#10003;</span>}
            <div className="provider-card-logo">{s.icon}</div>
            <div className="provider-card-name">{s.label}</div>
            <div className="provider-card-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Dynamic config fields */}
      {selected && (
        <>
          <div className="vs-section-label">{selected.label} Configuration</div>

          {selected.fields.map(field => (
            <div key={field.name} className="form-group">
              <label className="form-label">{field.label}</label>
              {field.multiline ? (
                <textarea
                  className="form-textarea"
                  placeholder={field.placeholder}
                  value={form.docSourceConfig[field.name] ?? ''}
                  onChange={e => setConfigField(field.name, e.target.value)}
                  rows={4}
                  style={{ fontFamily: 'DM Mono, monospace', fontSize: 12 }}
                />
              ) : (
                <input
                  type={field.secret ? 'password' : 'text'}
                  className="form-input"
                  placeholder={field.placeholder}
                  value={form.docSourceConfig[field.name] ?? ''}
                  onChange={e => setConfigField(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          {/* Local: also show file upload UI */}
          {form.docSourceType === 'local' && (
            <>
              <div className="vs-section-label">Or upload files directly</div>
              <label className="doc-dropzone">
                <span style={{ fontSize: 32 }}>📄</span>
                <span style={{ fontWeight: 600 }}>Drop files here or click to upload</span>
                <span style={{ fontSize: 12 }}>PDF, DOCX, TXT, MD — up to 50 MB each</span>
                <input
                  type="file" multiple accept=".pdf,.docx,.txt,.md"
                  style={{ display: 'none' }} onChange={handleFiles}
                />
              </label>
              {form.documents.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {form.documents.map(d => (
                    <div key={d.id} className="doc-file-row">
                      <span>📄</span>
                      <span style={{ flex: 1, fontWeight: 500 }}>{d.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{(d.size / 1024).toFixed(0)} KB</span>
                      <button
                        style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                        onClick={() => update({ documents: form.documents.filter(x => x.id !== d.id) })}
                      >&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

