import type { DashboardStats, ChartDataPoint, ActivityItem } from '../../types';

/** Mock dashboard statistics. */
export const mockStats: DashboardStats = {
  activePipelines: 12,
  activePipelinesTrend: '↑ 3 this month',
  indexedChunks: '284K',
  indexedChunksTrend: '↑ 12% vs last week',
  apiCallsToday: '41.2K',
  apiCallsTrend: '↑ 8% vs yesterday',
  avgLatencyMs: 187,
  latencyTrend: '↓ 22ms improvement',
};

/** 12-point time series for API call volume chart (7-day window). */
export const mockChartData: ChartDataPoint[] = [
  { day: 'M', calls: 28000 },
  { day: 'T', calls: 35000 },
  { day: 'W', calls: 31000 },
  { day: 'T', calls: 52000 },
  { day: 'F', calls: 47000 },
  { day: 'S', calls: 61000 },
  { day: 'S', calls: 55000 },
  { day: 'M', calls: 64000 },
  { day: 'T', calls: 44000 },
  { day: 'W', calls: 58000 },
  { day: 'T', calls: 51000 },
  { day: 'F', calls: 66000 },
];

/** Recent activity feed items. */
export const mockActivity: ActivityItem[] = [
  {
    icon: '▶',
    iconBg: '#EEF2FF',
    text: null,
    time: '3 min ago',
  },
  {
    icon: '↑',
    iconBg: '#E6FBF5',
    text: null,
    time: '18 min ago',
  },
  {
    icon: '⚷',
    iconBg: '#FFF5E6',
    text: null,
    time: '1 hr ago',
  },
  {
    icon: '◈',
    iconBg: '#F3EEFF',
    text: null,
    time: '4 hr ago',
  },
  {
    icon: '⊗',
    iconBg: '#FFF0F2',
    text: null,
    time: 'Yesterday',
  },
];

/** Typed activity descriptions (text field as strings for serialisability). */
export const mockActivityItems = [
  {
    icon: '▶',
    iconBg: '#EEF2FF',
    title: 'HR Policy Pipeline',
    body: 'finished indexing — 12,400 chunks added',
    time: '3 min ago',
  },
  {
    icon: '↑',
    iconBg: '#E6FBF5',
    title: 'jordan@acme.com',
    body: 'uploaded 5 documents to Legal Docs',
    time: '18 min ago',
  },
  {
    icon: '⚷',
    iconBg: '#FFF5E6',
    title: 'rf_...4a2f',
    body: 'New API key created (Read-only)',
    time: '1 hr ago',
  },
  {
    icon: '◈',
    iconBg: '#F3EEFF',
    title: 'text-embedding-3-large',
    body: 'Embedding model switched on Contracts Pipeline',
    time: '4 hr ago',
  },
  {
    icon: '⊗',
    iconBg: '#FFF0F2',
    title: 'Staging Pipeline',
    body: 'encountered an error — re-indexing',
    time: 'Yesterday',
  },
];
