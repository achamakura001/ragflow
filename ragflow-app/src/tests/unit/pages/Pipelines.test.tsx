import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Pipelines } from '../../../pages/Pipelines';

vi.mock('../../../hooks/usePipelines', () => ({
  usePipelines: () => ({
    pipelines: [
      {
        id: '1', name: 'HR Policy Bot', description: 'HR docs',
        embeddingProvider: 'openai', embeddingModel: 'text-embedding-3-small',
        vectorStore: 'pinecone', chunkingStrategy: 'sentence',
        chunkSize: 512, overlap: 64, topK: 5, minScore: 0.7,
        distanceMetric: 'cosine', chunks: 1240, status: 'active',
        lastRun: '2 hrs ago', owner: 'admin', tags: [], createdAt: '2024-01-01',
      },
    ],
    loading: false, error: null, refresh: () => {}, triggerRun: () => Promise.resolve(),
  }),
}));

describe('Pipelines', () => {
  it('renders page title', () => {
    render(<MemoryRouter><Pipelines /></MemoryRouter>);
    expect(screen.getByText('Pipelines')).toBeInTheDocument();
  });

  it('renders pipeline name', () => {
    render(<MemoryRouter><Pipelines /></MemoryRouter>);
    expect(screen.getByText('HR Policy Bot')).toBeInTheDocument();
  });
});
