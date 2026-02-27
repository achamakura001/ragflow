import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatCard } from '../../../components/ui/StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Active Pipelines" value={12} trend={{ value: '3 this month', up: true }} accent="blue" />);
    expect(screen.getByText('Active Pipelines')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders trend string', () => {
    render(<StatCard label="Calls" value="41.2K" trend={{ value: '8% vs yesterday', up: true }} accent="orange" />);
    expect(screen.getByText(/vs yesterday/)).toBeInTheDocument();
  });

  it('shows down trend', () => {
    render(<StatCard label="Latency" value="187ms" trend={{ value: '22ms improvement', up: false }} accent="purple" />);
    expect(screen.getByText(/22ms/)).toBeInTheDocument();
  });
});
