/**
 * APIKeys - list and revoke API keys.
 */
import React, { useState } from 'react';
import { Topbar }  from '../components/layout/Topbar';
import { Badge }   from '../components/ui/Badge';
import { Button }  from '../components/ui/Button';
import { useApiKeys } from '../hooks/useApiKeys';
import type { ApiKey } from '../types';

export const APIKeys: React.FC = () => {
  const { keys, loading, revoke } = useApiKeys();
  const [search, setSearch] = useState('');

  const filtered = keys.filter((k: ApiKey) => k.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Topbar title="API Keys" />
      <div className="content">
        <div style={{ marginBottom: 16 }}>
          <input
            className="form-input"
            placeholder="Search keys..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((k: ApiKey) => (
              <div key={k.id} className="api-key-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span className="key-name">{k.name}</span>
                      <Badge status={k.status} />
                    </div>
                    <div className="key-meta">
                      Created {new Date(k.createdAt).toLocaleDateString()} &middot; {k.calls30d.toLocaleString()} calls (30d)
                    </div>
                  </div>
                  {k.status === 'active' && (
                    <Button variant="danger" size="sm" onClick={() => revoke(k.id)}>Revoke</Button>
                  )}
                </div>
                <div className="key-mono">{k.key}</div>
                <div style={{ marginTop: 10 }}>
                  <span className="provider-chip">{k.scope}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
