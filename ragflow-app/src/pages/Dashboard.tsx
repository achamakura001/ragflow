/**
 * Dashboard - overview stats, pipeline list, API volume chart, activity feed.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Topbar }  from '../components/layout/Topbar';
import { StatCard } from '../components/ui/StatCard';
import { Badge }    from '../components/ui/Badge';
import { Button }   from '../components/ui/Button';
import { ApiVolumeChart } from '../components/ui/ApiVolumeChart';
import { useDashboard }   from '../hooks/useDashboard';
import { usePipelines }   from '../hooks/usePipelines';
import type { Pipeline }  from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, chartData, activity, loading: loadingStats } = useDashboard();
  const { pipelines, loading: loadingPipelines } = usePipelines();

  return (
    <>
      <div className="tenant-bar">
        <span className="tenant-badge">PRO</span>
        <span>acme-corp</span>
        <span style={{ marginLeft: 'auto' }}>12 of 20 pipelines used</span>
      </div>
      <Topbar
        title="Dashboard"
        actions={<Button onClick={() => navigate('/pipelines/new')}>+ New Pipeline</Button>}
      />
      <div className="content">
        <div className="stats-grid">
          <StatCard label="Total Pipelines"  value={loadingStats ? '...' : pipelines.length}  accent="blue"  trend={{ value: '+2 this week', up: true }} />
          <StatCard label="Active Pipelines" value={loadingStats ? '...' : stats?.activePipelines ?? 0} accent="green" sub="2 indexing" />
          <StatCard label="API Calls / 24h"  value={loadingStats ? '...' : stats?.apiCallsToday ?? 0} accent="orange" trend={{ value: stats?.apiCallsTrend ?? '+0%', up: true }} />
          <StatCard label="Avg Latency"      value={loadingStats ? '...' : (stats?.avgLatencyMs ?? 0) + 'ms'} accent="purple" trend={{ value: stats?.latencyTrend ?? '', up: true }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, marginBottom: 16 }}>
          <div className="card" style={{ padding: '20px 20px 12px' }}>
            <div className="card-header">
              <span className="card-title">API Volume</span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>Last 7 days</span>
            </div>
            <ApiVolumeChart data={chartData} />
          </div>

          <div className="card" style={{ padding: 20 }}>
            <div className="card-header">
              <span className="card-title">Recent Activity</span>
            </div>
            {activity.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon" style={{ background: a.iconBg }}>{a.icon}</div>
                <div className="activity-body">
                  <div className="activity-text">{a.title}: {a.body}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="card-title">Pipelines</span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/pipelines')}>View all</Button>
          </div>
          {loadingPipelines ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
          ) : (
            <table className="pipeline-table">
              <thead>
                <tr>
                  <th>Name</th><th>Status</th><th>Model</th><th>Chunks</th><th>Last Run</th>
                </tr>
              </thead>
              <tbody>
                {pipelines.slice(0, 5).map((p: Pipeline) => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/pipelines')}>
                    <td>
                      <div className="pipeline-name">{p.name}</div>
                      <div className="pipeline-desc">{p.description}</div>
                    </td>
                    <td><Badge status={p.status} /></td>
                    <td><span className="provider-chip">{p.embeddingModel}</span></td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{(p.chunks ?? 0).toLocaleString()}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--muted)' }}>{p.lastRun}</td>
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
