import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface ProblemStats {
  total: number;
  dsa: number;
  machineCoding: number;
  systemDesign: number;
  theory: number;
  byDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface UserStats {
  totalProblems: number;
  completedProblems: number;
  completionRate: number;
  averageScore: number;
  currentStreak: number;
  performanceByType: {
    dsa: { attempted: number; completed: number; averageScore: number };
    machineCoding: { attempted: number; completed: number; averageScore: number };
    systemDesign: { attempted: number; completed: number; averageScore: number };
    theory: { attempted: number; completed: number; averageScore: number };
  };
}

interface PracticeData {
  problemStats: ProblemStats | null;
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
}

export const usePracticeData = (): PracticeData => {
  const { user } = useAuth();
  const [problemStats, setProblemStats] = useState<ProblemStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPracticeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch problem stats (public data)
        const problemStatsResponse = await fetch('/api/problems/get-stats');
        if (!problemStatsResponse.ok) {
          throw new Error('Failed to fetch problem statistics');
        }
        const problemStatsData = await problemStatsResponse.json();

        // Fetch user stats (if user is authenticated)
        let userStatsData = null;
        if (user) {
          const userStatsResponse = await fetch('/api/dashboard/user-stats');
          if (userStatsResponse.ok) {
            userStatsData = await userStatsResponse.json();
          }
        }

        setProblemStats(problemStatsData);
        setUserStats(userStatsData);
      } catch (err) {
        console.error('Error fetching practice data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch practice data');
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeData();
  }, [user]);

  return {
    problemStats,
    userStats,
    loading,
    error,
  };
};
