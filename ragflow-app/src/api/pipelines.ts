/**
 * Pipeline API service.
 * Calls the real backend when VITE_USE_MOCK is not set,
 * otherwise returns mock data.
 */

import { apiFetch, USE_MOCK, mockDelay } from './client';
import { mockPipelines } from './mock/pipelines';
import type { Pipeline, PipelineFormData } from '../types';

/** Fetch all pipelines for the current tenant. */
export async function getPipelines(): Promise<Pipeline[]> {
  if (USE_MOCK) {
    await mockDelay();
    return mockPipelines;
  }
  return apiFetch<Pipeline[]>('/pipelines');
}

/** Fetch a single pipeline by ID. */
export async function getPipeline(id: string): Promise<Pipeline> {
  if (USE_MOCK) {
    await mockDelay(200);
    const p = mockPipelines.find((p) => p.id === id);
    if (!p) throw new Error(`Pipeline ${id} not found`);
    return p;
  }
  return apiFetch<Pipeline>(`/pipelines/${id}`);
}

/** Create a new pipeline from wizard form data. */
export async function createPipeline(data: PipelineFormData): Promise<Pipeline> {
  if (USE_MOCK) {
    await mockDelay(800);
    const newPipeline: Pipeline = {
      id: `pip_${Date.now()}`,
      name: data.name,
      description: data.description,
      embeddingProvider: 'openai',
      embeddingModel: data.embeddingModel,
      vectorStore: 'pinecone',
      chunkingStrategy: 'fixed',
      chunkSize: data.chunkSize,
      overlap: data.chunkOverlap,
      topK: data.topK,
      minScore: data.similarityThreshold,
      distanceMetric: 'cosine',
      chunks: 0,
      status: 'indexing',
      lastRun: 'Running…',
      owner: 'Jordan Dev',
      tags: data.tags,
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockPipelines.unshift(newPipeline);
    return newPipeline;
  }
  return apiFetch<Pipeline>('/pipelines', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Trigger a re-run / re-index of an existing pipeline. */
export async function runPipeline(id: string): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(300);
    return;
  }
  return apiFetch<void>(`/pipelines/${id}/run`, { method: 'POST' });
}

/** Delete a pipeline. */
export async function deletePipeline(id: string): Promise<void> {
  if (USE_MOCK) {
    await mockDelay(300);
    return;
  }
  return apiFetch<void>(`/pipelines/${id}`, { method: 'DELETE' });
}
