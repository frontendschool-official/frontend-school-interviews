import { NextApiResponse } from 'next';
import { getUserProgress } from '@/services/firebase/user-progress';
import { getUserProfile } from '@/services/firebase/user-profile';
import { getProblemById } from '@/services/firebase/problems';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

interface ProblemProgress {
  problemId: string;
  problemTitle?: string;
  problemType?: string;
  status: 'attempted' | 'completed';
  score?: number;
  timeSpent?: number;
  lastAttemptedAt: any;
  difficulty?: string;
}

interface UserStats {
  profile: any;
  progress: any[];
  recentActivity: any[];
  weeklyStats: {
    problemsAttempted: number;
    problemsCompleted: number;
    timeSpent: number;
    averageScore: number;
  };
  performanceByType: {
    dsa: { attempted: number; completed: number; averageScore: number };
    machineCoding: {
      attempted: number;
      completed: number;
      averageScore: number;
    };
    systemDesign: {
      attempted: number;
      completed: number;
      averageScore: number;
    };
    theory: { attempted: number; completed: number; averageScore: number };
  };
  totalProblems: number;
  completedProblems: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number;
  completionRate: number;
  averageTimePerProblem: number;
  averageScore: number;
  problemsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  problemsByType: {
    machineCoding: number;
    systemDesign: number;
    dsa: number;
    theory: number;
  };
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from authenticated session (verified server-side)
    const userId = req.userId!;

    // Fetch user progress and profile data in parallel
    const [userProgress, userProfile] = await Promise.all([
      getUserProgress(userId),
      getUserProfile(userId),
    ]);

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = userProgress.filter((progress: any) => {
      const lastAttempted =
        progress.lastAttemptedAt?.toDate?.() ||
        new Date(progress.lastAttemptedAt);
      return lastAttempted >= sevenDaysAgo;
    });

    // Calculate weekly stats
    const weeklyStats = {
      problemsAttempted: recentActivity.length,
      problemsCompleted: recentActivity.filter(
        (p: any) => p.status === 'completed'
      ).length,
      timeSpent: recentActivity.reduce(
        (total: number, p: any) => total + (p.timeSpent || 0),
        0
      ),
      averageScore:
        recentActivity.length > 0
          ? Math.round(
              recentActivity.reduce(
                (total: number, p: any) => total + (p.score || 0),
                0
              ) / recentActivity.length
            )
          : 0,
    };

    // Get recent problems with details (limit to 5 for performance)
    const recentProblemsWithDetails = await Promise.all(
      userProgress.slice(0, 5).map(async (progress: any) => {
        try {
          const problem = await getProblemById(progress.problemId);
          return {
            id: progress.problemId,
            title: problem?.title || progress.problemTitle || 'Unknown Problem',
            type:
              (problem as any)?.interviewType ||
              (problem as any)?.type ||
              progress.problemType ||
              'Unknown',
            status: progress.status,
            score: progress.score || 0,
            timeSpent: progress.timeSpent || 0,
            lastAttemptedAt: progress.lastAttemptedAt,
            difficulty: problem?.difficulty || 'medium',
          };
        } catch (error) {
          console.error('Error fetching problem details:', error);
          return {
            id: progress.problemId,
            title: progress.problemTitle || 'Unknown Problem',
            type: progress.problemType || 'Unknown',
            status: progress.status,
            score: progress.score || 0,
            timeSpent: progress.timeSpent || 0,
            lastAttemptedAt: progress.lastAttemptedAt,
            difficulty: 'medium',
          };
        }
      })
    );

    // Calculate performance by type with proper aggregation
    const performanceByType = {
      dsa: { attempted: 0, completed: 0, averageScore: 0 },
      machineCoding: { attempted: 0, completed: 0, averageScore: 0 },
      systemDesign: { attempted: 0, completed: 0, averageScore: 0 },
      theory: { attempted: 0, completed: 0, averageScore: 0 },
    };

    // Aggregate problems by type and difficulty
    const problemsByType = {
      machineCoding: 0,
      systemDesign: 0,
      dsa: 0,
      theory: 0,
    };

    const problemsByDifficulty = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    // Process each progress entry
    userProgress.forEach((progress: any) => {
      const problemType = progress.problemType?.toLowerCase() || 'unknown';
      const isCompleted = progress.status === 'completed';

      // Count by type
      if (problemType.includes('dsa') || problemType.includes('algorithm')) {
        performanceByType.dsa.attempted++;
        problemsByType.dsa++;
        if (isCompleted) performanceByType.dsa.completed++;
      } else if (
        problemType.includes('machine coding') ||
        problemType.includes('coding')
      ) {
        performanceByType.machineCoding.attempted++;
        problemsByType.machineCoding++;
        if (isCompleted) performanceByType.machineCoding.completed++;
      } else if (
        problemType.includes('system design') ||
        problemType.includes('design')
      ) {
        performanceByType.systemDesign.attempted++;
        problemsByType.systemDesign++;
        if (isCompleted) performanceByType.systemDesign.completed++;
      } else if (
        problemType.includes('theory') ||
        problemType.includes('concept')
      ) {
        performanceByType.theory.attempted++;
        problemsByType.theory++;
        if (isCompleted) performanceByType.theory.completed++;
      }

      // Count by difficulty (if available)
      const difficulty = progress.difficulty?.toLowerCase() || 'medium';
      if (difficulty === 'easy') problemsByDifficulty.easy++;
      else if (difficulty === 'hard') problemsByDifficulty.hard++;
      else problemsByDifficulty.medium++;
    });

    // Calculate average scores by type
    Object.keys(performanceByType).forEach(type => {
      const typeProgress = userProgress.filter((p: any) => {
        const problemType = p.problemType?.toLowerCase() || '';
        const isCorrectType =
          (type === 'dsa' &&
            (problemType.includes('dsa') ||
              problemType.includes('algorithm'))) ||
          (type === 'machineCoding' &&
            (problemType.includes('machine coding') ||
              problemType.includes('coding'))) ||
          (type === 'systemDesign' &&
            (problemType.includes('system design') ||
              problemType.includes('design'))) ||
          (type === 'theory' &&
            (problemType.includes('theory') ||
              problemType.includes('concept')));
        return isCorrectType && p.score;
      });

      if (typeProgress.length > 0) {
        performanceByType[type as keyof typeof performanceByType].averageScore =
          Math.round(
            typeProgress.reduce(
              (total: number, p: any) => total + (p.score || 0),
              0
            ) / typeProgress.length
          );
      }
    });

    // Calculate overall statistics
    const totalProblems = userProgress.length;
    const completedProblems = userProgress.filter(
      (p: any) => p.status === 'completed'
    ).length;
    const totalTimeSpent = userProgress.reduce(
      (total: number, p: any) => total + (p.timeSpent || 0),
      0
    );
    const completionRate =
      totalProblems > 0
        ? Math.round((completedProblems / totalProblems) * 100)
        : 0;
    const averageTimePerProblem =
      completedProblems > 0
        ? Math.round(totalTimeSpent / completedProblems)
        : 0;
    const averageScore =
      completedProblems > 0
        ? Math.round(
            userProgress
              .filter((p: any) => p.status === 'completed' && p.score)
              .reduce((total: number, p: any) => total + (p.score || 0), 0) /
              completedProblems
          )
        : 0;

    const userStats: UserStats = {
      profile: userProfile,
      progress: userProgress,
      recentActivity: recentProblemsWithDetails,
      weeklyStats,
      performanceByType,
      totalProblems,
      completedProblems,
      currentStreak: userProfile?.stats?.currentStreak || 0,
      longestStreak: userProfile?.stats?.longestStreak || 0,
      totalTimeSpent: userProfile?.stats?.totalTimeSpent || totalTimeSpent,
      completionRate,
      averageTimePerProblem,
      averageScore,
      problemsByDifficulty,
      problemsByType,
    };

    res.status(200).json(userStats);
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      error: 'Failed to get user statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
