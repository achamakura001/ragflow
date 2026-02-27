/**
 *  horizontal tab navigation using the mockup's .tab-bar CSS classes.TabBar 
 */
import React from 'react';

interface Tab { id: string; label: string; count?: number; }
interface TabBarProps { tabs: Tab[]; active: string; onChange: (id: string) => void; }

export const TabBar: React.FC<TabBarProps> = ({ tabs, active, onChange }) => (
  <div className="tab-bar">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`tab${active === tab.id ? ' active' : ''}`}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
        {tab.count !== undefined && (
          <span className="tab-count">{tab.count}</span>
        )}
      </button>
    ))}
  </div>
);
