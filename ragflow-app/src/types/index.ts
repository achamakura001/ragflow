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

export type PipelineEnv = 'dev' | 'qa' | 'perf' | 'prod';
export type PipelineFrequency = 'daily' | 'weekly' | 'monthly';

export type DocumentSourceType = 'gcs' | 'azure' | 'local';

/** Step 2 – Document source selection */
export interface PipelineFormData {
  // Step 1 – Identity & schedule
  name: string;
  description: string;
  tags: string[];
  environment: PipelineEnv;
  frequency: PipelineFrequency | '';
  scheduled_time: string;   // HH:MM local
  start_date: string;       // YYYY-MM-DD

  // Step 2 – Document source
  docSourceType: DocumentSourceType | '';
  docSourceConfig: Record<string, string>;   // type-specific config fields
  documents: UploadedDocument[];             // kept for local file display

  // Step 3 – Chunking (API-driven)
  chunkingStrategyId: number | null;
  chunkingStrategySlug: string;
  chunkSize: number;
  chunkOverlap: number;
  customSeparators: string[];

  // Step 4 – Embedding (API-driven)
  embeddingProviderSlug: string;
  embeddingConfigEnv: PipelineEnv | '';
  embeddingConfigId: string;
  embeddingModel: string;

  // Step 5 – Vector store (API-driven)
  vectorDbTypeSlug: string;
  vectorDbConnectionId: string;

  // Step 6 – Testing
  testQuery: string;
  topK: number;
  similarityThreshold: number;

  // Internal – draft pipeline ID returned from the API after Step 1 PUT
  _pipelineId: string | null;
}
