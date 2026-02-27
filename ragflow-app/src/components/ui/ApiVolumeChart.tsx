/**
 * ApiVolumeChart – Recharts bar chart for the dashboard API call volume widget.
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { ChartDataPoint } from '../../types';

interface ApiVolumeChartProps {
  data: ChartDataPoint[];
}

const formatK = (v: number) => `${(v / 1000).toFixed(0)}k`;

/**
 * Renders a Recharts bar chart showing API call volume per day.
 *
 * @param data - Array of `{ day, calls }` data points.
 */
export const ApiVolumeChart: React.FC<ApiVolumeChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={120}>
    <BarChart data={data} barSize={16}>
      <CartesianGrid vertical={false} stroke="#E0E3EB" strokeDasharray="3 3" />
      <XAxis
        dataKey="day"
        tick={{ fontSize: 10, fill: '#8892A4' }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        tickFormatter={formatK}
        tick={{ fontSize: 10, fill: '#8892A4' }}
        axisLine={false}
        tickLine={false}
        width={32}
      />
      <Tooltip
        formatter={(v) => {
          const num = typeof v === 'number' ? v : 0;
          return [`${num.toLocaleString()} calls`, 'Volume'];
        }}
        contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E0E3EB' }}
        cursor={{ fill: 'rgba(59,91,255,0.06)' }}
      />
      <Bar
        dataKey="calls"
        radius={[4, 4, 0, 0]}
        fill="url(#barGrad)"
      />
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B5BFF" stopOpacity={1} />
          <stop offset="100%" stopColor="#3B5BFF" stopOpacity={0.4} />
        </linearGradient>
      </defs>
    </BarChart>
  </ResponsiveContainer>
);
