/**
 * Sidebar - dark left navigation with grouped nav items.
 */
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface NavItem { path: string; icon: string; label: string; badge?: string; }

const WORKSPACE: NavItem[] = [
  { path: '/',              icon: '▦',  label: 'Dashboard' },
  { path: '/pipelines',    icon: '⟶', label: 'Pipelines', badge: '6' },
  { path: '/pipelines/new', icon: '+',  label: 'New Pipeline' },
];
const CONFIGURATION: NavItem[] = [
  { path: '/embeddings',    icon: '◈', label: 'Embeddings' },
  { path: '/vector-stores', icon: '⬡', label: 'Vector Stores' },
  { path: '/api-keys',      icon: '⬗', label: 'API Keys' },
];
const DEVELOPER: NavItem[] = [
  { path: '/retrieve-test', icon: '⚡', label: 'Test Retrieval' },
  { path: '/settings',      icon: '◎', label: 'Settings' },
];

const NavGroup: React.FC<{ label: string; items: NavItem[] }> = ({ label, items }) => (
  <div className="sidebar-section">
    <div className="sidebar-label">{label}</div>
    {items.map((item) => (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
      >
        <span style={{ opacity: 0.8, fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && <span className="nav-badge">{item.badge}</span>}
      </NavLink>
    ))}
  </div>
);

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <div className="logo-mark">R</div>
        RAGFlow
      </div>
      <NavGroup label="Workspace"     items={WORKSPACE} />
      <NavGroup label="Configuration" items={CONFIGURATION} />
      <NavGroup label="Developer"     items={DEVELOPER} />
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">JD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">Jordan Dev</div>
            <div className="user-role">Pipeline Owner</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
