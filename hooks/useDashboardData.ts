import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

import { apiClient } from '../lib/api-client';

interface DashboardData {
  stats: {
    problemsSolved: number;
    timeSpent: number;
    successRate: number;
    currentStreak: number;
  };
  progress: {
    dsa: { completed: number; total: number; percentage: number };
    machineCoding: { completed: number; total: number; percentage: number };
    systemDesign: { completed: number; total: number; percentage: number };
    theory: { completed: number; total: number; percentage: number };
  };
  recentProblems: Array<{
    id: string;
    title: string;
    type: 'DSA' | 'Machine Coding' | 'System Design' | 'Theory';
    status: 'completed' | 'in-progress' | 'failed';
    date: string;
    score?: number;
  }>;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (): DashboardData => {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [problemStats, setProblemStats] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch progress and stats in parallel; fire-and-forget streak update
        const progressPromise = fetch(`/api/user-profile/progress`, {
          headers: { 'Cache-Control': 'no-store' },
        }).then(async r => (r.ok ? r.json() : Promise.reject(r.statusText)));

        const statsPromise = apiClient.getProblemStats();

        // Fire-and-forget to avoid blocking UI
        fetch('/api/user-profile/update-streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }).catch(() => {});

        const [progressData, statsResponse] = await Promise.all([
          progressPromise,
          statsPromise,
        ]);

        setUserProgress(progressData.progress || []);
        if (!statsResponse.error) {
          setProblemStats(statsResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.uid]);

  // Calculate stats from user profile and progress data
  const calculateStats = (): DashboardData['stats'] => {
    if (!userProfile?.stats) {
      return {
        problemsSolved: 0,
        timeSpent: 0,
        successRate: 0,
        currentStreak: 0,
      };
    }

    const stats = userProfile.stats;
    const successRate =
      stats.totalProblemsAttempted > 0
        ? Math.round(
            (stats.totalProblemsCompleted / stats.totalProblemsAttempted) * 100
          )
        : 0;

    return {
      problemsSolved: stats.totalProblemsCompleted,
      timeSpent: Math.round(stats.totalTimeSpent / 60), // Convert minutes to hours
      successRate,
      currentStreak: stats.currentStreak,
    };
  };

  // Calculate progress by problem type
  const calculateProgress = (): DashboardData['progress'] => {
    const completedByType = {
      dsa: 0,
      machineCoding: 0,
      systemDesign: 0,
      theory: 0,
    };

    // Get total problems from API response
    const totalByType = {
      dsa: problemStats?.dsa || 0,
      machineCoding: problemStats?.machineCoding || 0,
      systemDesign: problemStats?.systemDesign || 0,
      theory: problemStats?.theory || 0,
    };

    // Count completed problems by type
    userProgress.forEach(progress => {
      if (progress.status === 'completed') {
        switch (progress.problemType?.toLowerCase()) {
          case 'dsa':
            completedByType.dsa++;
            break;
          case 'machine coding':
            completedByType.machineCoding++;
            break;
          case 'system design':
            completedByType.systemDesign++;
            break;
          case 'theory':
            completedByType.theory++;
            break;
        }
      }
    });

    return {
      dsa: {
        completed: completedByType.dsa,
        total: totalByType.dsa,
        percentage:
          totalByType.dsa > 0
            ? Math.round((completedByType.dsa / totalByType.dsa) * 100)
            : 0,
      },
      machineCoding: {
        completed: completedByType.machineCoding,
        total: totalByType.machineCoding,
        percentage:
          totalByType.machineCoding > 0
            ? Math.round(
                (completedByType.machineCoding / totalByType.machineCoding) *
                  100
              )
            : 0,
      },
      systemDesign: {
        completed: completedByType.systemDesign,
        total: totalByType.systemDesign,
        percentage:
          totalByType.systemDesign > 0
            ? Math.round(
                (completedByType.systemDesign / totalByType.systemDesign) * 100
              )
            : 0,
      },
      theory: {
        completed: completedByType.theory,
        total: totalByType.theory,
        percentage:
          totalByType.theory > 0
            ? Math.round((completedByType.theory / totalByType.theory) * 100)
            : 0,
      },
    };
  };

  // Calculate recent problems
  const calculateRecentProblems = (): DashboardData['recentProblems'] => {
    return userProgress
      .slice(0, 5) // Get last 5 problems
      .map(progress => {
        const getType = (
          problemType: string
        ): 'DSA' | 'Machine Coding' | 'System Design' | 'Theory' => {
          switch (problemType?.toLowerCase()) {
            case 'dsa':
              return 'DSA';
            case 'machine coding':
              return 'Machine Coding';
            case 'system design':
              return 'System Design';
            case 'theory':
              return 'Theory';
            default:
              return 'DSA';
          }
        };

        const getStatus = (
          status: string
        ): 'completed' | 'in-progress' | 'failed' => {
          switch (status) {
            case 'completed':
              return 'completed';
            case 'attempted':
              return 'in-progress';
            case 'failed':
              return 'failed';
            default:
              return 'in-progress';
          }
        };

        const formatDate = (timestamp: any): string => {
          if (!timestamp) return 'Unknown';

          const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
          const now = new Date();
          const diffInHours = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60)
          );

          if (diffInHours < 1) return 'Just now';
          if (diffInHours < 24) return `${diffInHours} hours ago`;
          if (diffInHours < 48) return '1 day ago';
          return `${Math.floor(diffInHours / 24)} days ago`;
        };

        return {
          id: progress.problemId,
          title: progress.problemTitle || 'Unknown Problem',
          type: getType(progress.problemType),
          status: getStatus(progress.status),
          date: formatDate(progress.lastAttemptedAt),
          score: progress.score || undefined,
        };
      });
  };

  return {
    stats: calculateStats(),
    progress: calculateProgress(),
    recentProblems: calculateRecentProblems(),
    loading,
    error,
  };
};
