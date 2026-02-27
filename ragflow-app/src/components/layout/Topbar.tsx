import React from 'react';

interface TopbarProps { title: string; actions?: React.ReactNode; }

export const Topbar: React.FC<TopbarProps> = ({ title, actions }) => (
  <div className="topbar">
    <span className="page-title">{title}</span>
    {actions && <div className="topbar-actions">{actions}</div>}
  </div>
);
