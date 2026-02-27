import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../../../components/ui/Badge';

describe('Badge', () => {
  it('renders Active badge with correct label', () => {
    const { container } = render(<Badge status="active" />);
    expect(container.querySelector('.badge.active')).toBeTruthy();
    expect(container.textContent).toContain('Active');
  });

  it('renders Indexing badge', () => {
    const { container } = render(<Badge status="indexing" />);
    expect(container.querySelector('.badge.indexing')).toBeTruthy();
  });

  it('renders Draft badge', () => {
    render(<Badge status="draft" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders Error badge', () => {
    render(<Badge status="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });
});
