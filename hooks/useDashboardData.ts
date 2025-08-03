import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserProgress, getUserProfile, updateUserStreak } from '../services/firebase';
import { UserStats } from '../types/user';

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user progress data
        const progress = await getUserProgress(user.uid);
        setUserProgress(progress);

        // Update user streak (this will only update if needed)
        await updateUserStreak(user.uid);

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
    const successRate = stats.totalProblemsAttempted > 0 
      ? Math.round((stats.totalProblemsCompleted / stats.totalProblemsAttempted) * 100)
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

    const totalByType = {
      dsa: 20, // Mock totals - these could come from a problems collection
      machineCoding: 15,
      systemDesign: 10,
      theory: 25,
    };

    // Count completed problems by type
    userProgress.forEach((progress) => {
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
        percentage: Math.round((completedByType.dsa / totalByType.dsa) * 100),
      },
      machineCoding: {
        completed: completedByType.machineCoding,
        total: totalByType.machineCoding,
        percentage: Math.round((completedByType.machineCoding / totalByType.machineCoding) * 100),
      },
      systemDesign: {
        completed: completedByType.systemDesign,
        total: totalByType.systemDesign,
        percentage: Math.round((completedByType.systemDesign / totalByType.systemDesign) * 100),
      },
      theory: {
        completed: completedByType.theory,
        total: totalByType.theory,
        percentage: Math.round((completedByType.theory / totalByType.theory) * 100),
      },
    };
  };

  // Calculate recent problems
  const calculateRecentProblems = (): DashboardData['recentProblems'] => {
    return userProgress
      .slice(0, 5) // Get last 5 problems
      .map((progress) => {
        const getType = (problemType: string): 'DSA' | 'Machine Coding' | 'System Design' | 'Theory' => {
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

        const getStatus = (status: string): 'completed' | 'in-progress' | 'failed' => {
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
          
          const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
          const now = new Date();
          const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
          
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