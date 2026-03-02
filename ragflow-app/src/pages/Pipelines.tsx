/**
 * Pipelines – list view with tab filters (All / Active / Inactive / Draft),
 * search, and Edit / Delete actions per row.
 *
 * Data is fetched live from GET /api/v1/pipelines.
 * Delete calls DELETE /api/v1/pipelines/{id} after a confirmation prompt.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar }  from '../components/layout/Topbar';
import { TabBar }  from '../components/ui/TabBar';
import { Button }  from '../components/ui/Button';
import { listPipelines, deletePipeline, type PipelineRead } from '../api/pipelinesApi';

// ── Status helpers ────────────────────────────────────────────────────────────

/** API statuses: draft | active | paused | archived
 *  We display paused + archived both as "inactive". */
type TabId = 'all' | 'active' | 'inactive' | 'draft';

function tabMatchesStatus(tabId: TabId, status: string): boolean {
  if (tabId === 'all') return true;
  if (tabId === 'inactive') return status === 'paused' || status === 'archived';
  return status === tabId;
}

const STATUS_LABEL: Record<string, string> = {
  active:   'Active',
  draft:    'Draft',
  paused:   'Inactive',
  archived: 'Inactive',
};

const STATUS_CLASS: Record<string, string> = {
  active:   'badge badge-green',
  draft:    'badge badge-blue',
  paused:   'badge badge-gray',
  archived: 'badge badge-gray',
};

const TABS: { id: TabId; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'active',   label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'draft',    label: 'Draft' },
];

// ── Delete confirmation modal ─────────────────────────────────────────────────
interface DeleteModalProps {
  pipeline: PipelineRead;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}
const DeleteModal: React.FC<DeleteModalProps> = ({ pipeline, onConfirm, onCancel, deleting }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  }}>
    <div className="card" style={{ maxWidth: 440, width: '90%', padding: 28 }}>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Delete Pipeline?</div>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
        This will permanently delete <strong>{pipeline.name}</strong> and all its data.
        This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button variant="ghost" onClick={onCancel} disabled={deleting}>Cancel</Button>
        <button
          type="button"
          className="btn"
          style={{ background: 'var(--error, #ef4444)', color: '#fff', padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600 }}
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export const Pipelines: React.FC = () => {
  const navigate = useNavigate();

  const [pipelines, setPipelines] = useState<PipelineRead[]>([]);
  const [loading, setLoading]     = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [search, setSearch]       = useState('');

  // Delete state
  const [toDelete, setToDelete]   = useState<PipelineRead | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setFetchError('');
    listPipelines()
      .then(r => setPipelines(r.items))
      .catch(e => setFetchError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = pipelines.filter(p => {
    const matchTab    = tabMatchesStatus(activeTab, p.status);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabsWithCount = TABS.map(t => ({
    ...t,
    count: t.id === 'all'
      ? pipelines.length
      : pipelines.filter(p => tabMatchesStatus(t.id, p.status)).length,
  }));

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deletePipeline(toDelete.id);
      setPipelines(ps => ps.filter(p => p.id !== toDelete.id));
      setToDelete(null);
    } catch (e: unknown) {
      setDeleteError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Topbar
        title="Pipelines"
        actions={<Button onClick={() => navigate('/pipelines/new')}>+ New Pipeline</Button>}
      />
      <div className="content">
        {deleteError && (
          <div className="form-error" style={{ marginBottom: 12 }}>
            Delete failed: {deleteError}
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ padding: '16px 20px 0', borderBottom: '1px solid var(--border)' }}>
            <TabBar tabs={tabsWithCount} active={activeTab} onChange={v => setActiveTab(v as TabId)} />
          </div>

          {/* Search */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <input
              className="form-input"
              placeholder="Search pipelines…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 320 }}
            />
          </div>

          {/* Body */}
          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>
          ) : fetchError ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <p className="form-error">{fetchError}</p>
              <Button variant="ghost" onClick={load} style={{ marginTop: 12 }}>Retry</Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⟶</div>
              <div className="empty-state-title">No pipelines found</div>
              <div className="empty-state-desc">Try adjusting your filters or create a new pipeline.</div>
              <Button onClick={() => navigate('/pipelines/new')}>+ New Pipeline</Button>
            </div>
          ) : (
            <table className="pipeline-table">
              <thead>
                <tr>
                  <th>Pipeline</th>
                  <th>Status</th>
                  <th>Environment</th>
                  <th>Embedding Model</th>
                  <th>Source</th>
                  <th>Updated</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="pipeline-name">{p.name}</div>
                      {p.description && <div className="pipeline-desc">{p.description}</div>}
                      {p.tags?.length > 0 && (
                        <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {p.tags.map(tag => (
                            <span key={tag} className="badge badge-gray" style={{ fontSize: 10 }}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={STATUS_CLASS[p.status] ?? 'badge badge-gray'}>
                        {STATUS_LABEL[p.status] ?? p.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.environment === 'prod' ? 'badge-red' : 'badge-blue'}`}>
                        {p.environment}
                      </span>
                    </td>
                    <td>
                      {p.embedding_model
                        ? <span className="provider-chip">{p.embedding_model}</span>
                        : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>}
                    </td>
                    <td>
                      {p.source_type
                        ? <span className="provider-chip">{p.source_type}</span>
                        : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(p.updated_at).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/pipelines/${p.id}/edit`)}
                        >
                          ✎ Edit
                        </Button>
                        <button
                          type="button"
                          className="btn"
                          style={{
                            background: 'none', border: '1px solid var(--error, #ef4444)',
                            color: 'var(--error, #ef4444)', borderRadius: 6,
                            padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500,
                          }}
                          onClick={() => { setDeleteError(''); setToDelete(p); }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {toDelete && (
        <DeleteModal
          pipeline={toDelete}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
          deleting={deleting}
        />
      )}
    </>
  );
};
