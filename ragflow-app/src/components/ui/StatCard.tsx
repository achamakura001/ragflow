import React from 'react';

type Accent = 'blue' | 'green' | 'orange' | 'purple';

interface StatCardProps {
  label:  string;
  value:  string | number;
  sub?:   string;
  trend?: { value: string; up: boolean };
  accent: Accent;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, trend, accent }) => (
  <div className={"stat-card " + accent}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
    {trend && (
      <div className={"stat-trend " + (trend.up ? "trend-up" : "trend-down")}>
        {trend.up ? "↑" : "↓"} {trend.value}
      </div>
    )}
  </div>
);
