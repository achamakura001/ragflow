/**
 * Shared TypeScript types for RAGFlow.
 * All API responses and component props reference these interfaces.
 */

export type PipelineStatus = 'active' | 'indexing' | 'draft' | 'error';

export type EmbeddingProvider = 'openai' | 'cohere' | 'huggingface' | 'azure' | 'custom';

export type VectorStoreProvider =
  | 'pinecone'
  | 'qdrant'
  | 'pgvector'
  | 'weaviate'
  | 'chroma'
  | 'milvus';

export type ChunkingStrategy = 'fixed' | 'sentence' | 'paragraph' | 'semantic' | 'custom';

export type DistanceMetric = 'cosine' | 'euclidean' | 'dot';

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  embeddingProvider: EmbeddingProvider;
  embeddingModel: string;
  vectorStore: VectorStoreProvider;
  chunkingStrategy: ChunkingStrategy;
  chunkSize: number;
  overlap: number;
  topK: number;
  minScore: number;
  distanceMetric: DistanceMetric;
  chunks: number;
  status: PipelineStatus;
  lastRun: string;
  owner: string;
  tags: string[];
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  scope: string;
  createdAt: string;
  calls30d: number;
  status: 'active' | 'revoked';
}

export interface RetrievalResult {
  score: number;
  source: string;
  text: string;
}

export interface RetrievalRequest {
  pipelineId: string;
  query: string;
  topK: number;
  minScore: number;
  filters?: Record<string, string>;
}

export interface ActivityItem {
  icon: string;
  iconBg: string;
  text: React.ReactNode;
  time: string;
}

export interface DashboardStats {
  activePipelines: number;
  activePipelinesTrend: string;
  indexedChunks: string;
  indexedChunksTrend: string;
  apiCallsToday: string;
  apiCallsTrend: string;
  avgLatencyMs: number;
  latencyTrend: string;
}

export interface ChartDataPoint {
  day: string;
  calls: number;
}

export interface TeamMember {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface UsageMetric {
  label: string;
  used: number;
  limit: number;
}

export interface TenantSettings {
  name: string;
  slug: string;
  plan: string;
  mfaEnabled: boolean;
  auditLogRetention: string;
  usage: UsageMetric[];
  team: TeamMember[];
}

/** Document object used in the pipeline builder upload step */
export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  status: 'uploaded' | 'processing' | 'ready' | 'error';
}

/** Wizard form data collected across all 7 builder steps */
export interface PipelineFormData {
  name: string;
  description: string;
  tags: string[];
  documents: UploadedDocument[];
  chunkingStrategy: ChunkingStrategy;
  chunkSize: number;
  chunkOverlap: number;
  customSeparators: string[];
  embeddingProvider: string;
  embeddingModel: string;
  embeddingApiKey: string;
  vectorStore: string;
  vectorStoreConfig: Record<string, string>;
  testQuery: string;
  topK: number;
  similarityThreshold: number;
}
