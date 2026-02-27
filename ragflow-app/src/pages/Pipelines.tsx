/**
 * Pipelines - list view with tab filters, search.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar }  from '../components/layout/Topbar';
import { TabBar }  from '../components/ui/TabBar';
import { Badge }   from '../components/ui/Badge';
import { Button }  from '../components/ui/Button';
import { usePipelines } from '../hooks/usePipelines';
import type { Pipeline, PipelineStatus } from '../types';

const TABS = [
  { id: 'all',      label: 'All' },
  { id: 'active',   label: 'Active' },
  { id: 'indexing', label: 'Indexing' },
  { id: 'draft',    label: 'Draft' },
];

export const Pipelines: React.FC = () => {
  const navigate = useNavigate();
  const { pipelines, loading } = usePipelines();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = pipelines.filter((p: Pipeline) => {
    const matchTab = activeTab === 'all' || p.status === activeTab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabsWithCount = TABS.map(t => ({
    ...t,
    count: t.id === 'all' ? pipelines.length : pipelines.filter((p: Pipeline) => p.status === (t.id as PipelineStatus)).length,
  }));

  return (
    <>
      <Topbar
        title="Pipelines"
        actions={<Button onClick={() => navigate('/pipelines/new')}>+ New Pipeline</Button>}
      />
      <div className="content">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 0', borderBottom: '1px solid var(--border)' }}>
            <TabBar tabs={tabsWithCount} active={activeTab} onChange={setActiveTab} />
          </div>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
            <input
              className="form-input"
              placeholder="Search pipelines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 320 }}
            />
          </div>

          {loading ? (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
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
                  <th>Pipeline</th><th>Status</th><th>Embedding Model</th>
                  <th>Vector Store</th><th>Chunks</th><th>Last Run</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p: Pipeline) => (
                  <tr key={p.id}>
                    <td>
                      <div className="pipeline-name">{p.name}</div>
                      <div className="pipeline-desc">{p.description}</div>
                    </td>
                    <td><Badge status={p.status} /></td>
                    <td><span className="provider-chip">{p.embeddingModel}</span></td>
                    <td><span className="provider-chip">{p.vectorStore}</span></td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{(p.chunks ?? 0).toLocaleString()}</td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{p.lastRun}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/retrieve-test')}>Test</Button>
                        <Button variant="ghost" size="sm" onClick={() => {}}>Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
