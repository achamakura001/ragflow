import React from 'react';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const Shell: React.FC = () => (
  <div className="shell">
    <Sidebar />
    <div className="main">
      <Outlet />
    </div>
  </div>
);
