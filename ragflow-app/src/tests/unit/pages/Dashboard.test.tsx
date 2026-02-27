import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from '../../../pages/Dashboard';

vi.mock('../../../hooks/useDashboard', () => ({
  useDashboard: () => ({
    loading: false,
    stats: {
      activePipelines: 12,
      activePipelinesTrend: '3 this month',
      indexedChunks: '284K',
      indexedChunksTrend: '12% vs last week',
      apiCallsToday: '41.2K',
      apiCallsTrend: '8% vs yesterday',
      avgLatencyMs: 187,
      latencyTrend: '22ms improvement',
    },
    chartData: [{ day: 'M', calls: 28000 }],
    activity: [],
    error: null,
  }),
}));

vi.mock('../../../hooks/usePipelines', () => ({
  usePipelines: () => ({ pipelines: [], loading: false, error: null }),
}));

describe('Dashboard', () => {
  const wrap = (ui: React.ReactNode) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  it('renders the page title', () => {
    wrap(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders stat cards', () => {
    wrap(<Dashboard />);
    expect(screen.getByText('Active Pipelines')).toBeInTheDocument();
  });
});
