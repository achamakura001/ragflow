/**
 * useDashboard – fetches stats, chart data, and activity feed.
 */

import { useState, useEffect } from 'react';
import { mockDelay } from '../api/client';
import { mockStats, mockChartData, mockActivityItems } from '../api/mock/dashboard';
import type { DashboardStats, ChartDataPoint } from '../types';

interface DashboardData {
  stats: DashboardStats | null;
  chartData: ChartDataPoint[];
  activity: typeof mockActivityItems;
  loading: boolean;
  error: string | null;
}

/** Returns dashboard statistics, chart series, and the activity feed. */
export function useDashboard(): DashboardData {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [activity, setActivity] = useState<typeof mockActivityItems>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await mockDelay();
        setStats(mockStats);
        setChartData(mockChartData);
        setActivity(mockActivityItems);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stats, chartData, activity, loading, error };
}
