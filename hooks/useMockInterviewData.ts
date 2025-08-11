import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface MockInterviewStats {
  totalInterviews: number;
  averageScore: number;
  completedRounds: number;
  totalTime: string;
}

interface RecentActivity {
  id: string;
  title: string;
  company: string;
  status: 'completed' | 'in-progress' | 'failed';
  score?: number;
  timeSpent?: string;
  completedAt?: string;
  type: string;
}

interface MockInterviewData {
  stats: MockInterviewStats;
  recentActivity: RecentActivity[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useMockInterviewData = (): MockInterviewData => {
  const { user } = useAuth();
  const [stats, setStats] = useState<MockInterviewStats>({
    totalInterviews: 0,
    averageScore: 0,
    completedRounds: 0,
    totalTime: '0h 0m'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMockInterviewData = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch mock interview statistics from dedicated API
      const response = await fetch(`/api/mock-interviews/stats?userId=${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mock interview statistics');
      }
      
      const data = await response.json();
      
      setStats({
        totalInterviews: data.totalInterviews || 0,
        averageScore: data.averageScore || 0,
        completedRounds: data.completedRounds || 0,
        totalTime: data.totalTime || '0h 0m'
      });

      setRecentActivity(data.recentActivity || []);

    } catch (err) {
      console.error('Error fetching mock interview data:', err);
      setError('Failed to load mock interview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockInterviewData();
  }, [user?.uid]);

  const refresh = () => {
    fetchMockInterviewData();
  };

  return {
    stats,
    recentActivity,
    loading,
    error,
    refresh
  };
}; 