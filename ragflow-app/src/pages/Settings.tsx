/**
 *  tenant configuration, quota management, danger zone.Settings 
 */
import React, { useState } from 'react';
import { Topbar } from '../components/layout/Topbar';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TabBar }      from '../components/ui/TabBar';

const TABS = [
  { id: 'general',   label: 'General' },
  { id: 'quota',     label: 'Quota & Billing' },
  { id: 'security',  label: 'Security' },
  { id: 'danger',    label: 'Danger Zone' },
];

export const Settings: React.FC = () => {
  const [tab, setTab] = useState('general');
  const [orgName, setOrgName]   = useState('Acme Corp');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [retentionDays, setRetentionDays] = useState(30);

  return (
    <>
      <Topbar title="Settings" actions={<Button onClick={() => {}}>Save Changes</Button>} />
      <div className="content">
        <TabBar tabs={TABS} active={tab} onChange={setTab} />

        {tab === 'general' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header"><span className="card-title">General Settings</span></div>
            <div className="form-group">
              <label className="form-label">Organisation Name</label>
              <input className="form-input" value={orgName} onChange={e => setOrgName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Default Chunk Size</label>
              <input className="form-input" type="number" defaultValue={512} />
              <span className="form-sublabel">Characters per chunk when splitting documents.</span>
            </div>
            <div className="form-group">
              <label className="form-label">Chunk Overlap</label>
              <input className="form-input" type="number" defaultValue={64} />
            </div>
            <div className="form-group">
              <label className="form-label">Webhook URL</label>
              <input className="form-input" placeholder="https://..." value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} />
            </div>
            <div className="settings-row" style={{ border: 'none', paddingTop: 0 }}>
              <div>
                <div className="settings-row-label">Enable Webhooks</div>
                <div className="settings-row-desc">POST pipeline events to the URL above.</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        )}

        {tab === 'quota' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header"><span className="card-title">Quota &amp; Usage</span></div>
            {[
              { label: 'Pipelines',    used: 12, total: 20 },
              { label: 'Documents',    used: 8430, total: 50000 },
              { label: 'Embedding calls / month', used: 78230, total: 100000 },
              { label: 'API calls / day', used: 1840, total: 10000 },
            ].map(q => (
              <div key={q.label} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                  <span>{q.label}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--muted)' }}>{q.used.toLocaleString()} / {q.total.toLocaleString()}</span>
                </div>
                <ProgressBar value={q.used} max={q.total} />
              </div>
            ))}
            <Button style={{ marginTop: 8 }}>Upgrade Plan</Button>
          </div>
        )}

        {tab === 'security' && (
          <div className="card" style={{ maxWidth: 640 }}>
            <div className="card-header"><span className="card-title">Security</span></div>
            {[
              { label: 'Require MFA', desc: 'All team members must use two-factor authentication.' },
              { label: 'IP Allowlist', desc: 'Restrict API access to specific IP ranges.' },
              { label: 'Audit Log', desc: 'Log all admin actions for compliance.' },
            ].map(s => (
              <div key={s.label} className="settings-row">
                <div>
                  <div className="settings-row-label">{s.label}</div>
                  <div className="settings-row-desc">{s.desc}</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Log Retention (days)</label>
              <input className="form-input" type="number" value={retentionDays} onChange={e => setRetentionDays(+e.target.value)} style={{ width: 120 }} />
            </div>
          </div>
        )}

        {tab === 'danger' && (
          <div className="card" style={{ maxWidth: 640, border: '1.5px solid rgba(255,77,106,0.3)' }}>
            <div className="card-header">
              <span className="card-title" style={{ color: 'var(--error)' }}>Danger Zone</span>
            </div>
            {[
              { label: 'Delete All Pipelines', desc: 'Permanently delete all pipelines and their data. This cannot be undone.' },
              { label: 'Reset Tenant', desc: 'Wipe all settings and data, resetting the organisation to default state.' },
            ].map(d => (
              <div key={d.label} className="settings-row">
                <div>
                  <div className="settings-row-label">{d.label}</div>
                  <div className="settings-row-desc">{d.desc}</div>
                </div>
                <Button variant="danger" size="sm">{d.label.split(' ')[0]}</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
