import { getFirestore } from 'firebase-admin/firestore';
import { UserProgressRepo } from './user-progress';
import { UserProfileRepo } from './user-profile';
import { ProblemRepo } from './problems';

export interface UserStats {
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
    machineCoding: { attempted: number; completed: number; averageScore: number };
    systemDesign: { attempted: number; completed: number; averageScore: number };
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

export class DashboardRepo {
  private readonly progressRepo = new UserProgressRepo();
  private readonly profileRepo = new UserProfileRepo();
  private readonly problemRepo = new ProblemRepo();

  async getUserStats(uid: string): Promise<UserStats> {
    // Fetch user progress and profile data in parallel
    const [userProgress, userProfile] = await Promise.all([
      this.getUserProgress(uid),
      this.profileRepo.getById(uid),
    ]);

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = userProgress.filter((progress: any) => {
      const lastAttempted = progress.lastAttemptedAt?.toDate?.() || new Date(progress.lastAttemptedAt);
      return lastAttempted >= sevenDaysAgo;
    });

    // Calculate weekly stats
    const weeklyStats = {
      problemsAttempted: recentActivity.length,
      problemsCompleted: recentActivity.filter((p: any) => p.status === 'completed').length,
      timeSpent: recentActivity.reduce((total: number, p: any) => total + (p.timeSpent || 0), 0),
      averageScore: this.calculateAverageScore(recentActivity),
    };

    // Calculate performance by type
    const performanceByType = this.calculatePerformanceByType(userProgress);

    // Calculate overall stats
    const totalProblems = userProgress.length;
    const completedProblems = userProgress.filter((p: any) => p.status === 'completed').length;
    const totalTimeSpent = userProgress.reduce((total: number, p: any) => total + (p.timeSpent || 0), 0);
    const completionRate = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;
    const averageTimePerProblem = completedProblems > 0 ? totalTimeSpent / completedProblems : 0;
    const averageScore = this.calculateAverageScore(userProgress);

    // Calculate problems by difficulty and type
    const problemsByDifficulty = this.calculateProblemsByDifficulty(userProgress);
    const problemsByType = this.calculateProblemsByType(userProgress);

    return {
      profile: userProfile,
      progress: userProgress,
      recentActivity,
      weeklyStats,
      performanceByType,
      totalProblems,
      completedProblems,
      currentStreak: userProfile.streak || 0,
      longestStreak: userProfile.longestStreak || 0,
      totalTimeSpent,
      completionRate,
      averageTimePerProblem,
      averageScore,
      problemsByDifficulty,
      problemsByType,
    };
  }

  private async getUserProgress(uid: string): Promise<any[]> {
    // TODO: Implement progress aggregation from UserProgressRepo
    // For now, return empty array - this would need to be implemented
    // by adding methods to UserProgressRepo to fetch aggregated progress
    return [];
  }

  private calculateAverageScore(progress: any[]): number {
    const completedWithScores = progress.filter((p: any) => p.status === 'completed' && p.score !== undefined);
    if (completedWithScores.length === 0) return 0;
    const totalScore = completedWithScores.reduce((sum: number, p: any) => sum + p.score, 0);
    return totalScore / completedWithScores.length;
  }

  private calculatePerformanceByType(progress: any[]): UserStats['performanceByType'] {
    const types = ['dsa', 'machineCoding', 'systemDesign', 'theory'];
    const result: UserStats['performanceByType'] = {
      dsa: { attempted: 0, completed: 0, averageScore: 0 },
      machineCoding: { attempted: 0, completed: 0, averageScore: 0 },
      systemDesign: { attempted: 0, completed: 0, averageScore: 0 },
      theory: { attempted: 0, completed: 0, averageScore: 0 },
    };

    types.forEach(type => {
      const typeProgress = progress.filter((p: any) => p.problemType === type);
      const attempted = typeProgress.length;
      const completed = typeProgress.filter((p: any) => p.status === 'completed').length;
      const averageScore = this.calculateAverageScore(typeProgress);

      result[type as keyof UserStats['performanceByType']] = {
        attempted,
        completed,
        averageScore,
      };
    });

    return result;
  }

  private calculateProblemsByDifficulty(progress: any[]): UserStats['problemsByDifficulty'] {
    const difficulties = ['easy', 'medium', 'hard'];
    const result: UserStats['problemsByDifficulty'] = {
      easy: 0,
      medium: 0,
      hard: 0,
    };

    difficulties.forEach(difficulty => {
      result[difficulty as keyof UserStats['problemsByDifficulty']] = 
        progress.filter((p: any) => p.difficulty === difficulty).length;
    });

    return result;
  }

  private calculateProblemsByType(progress: any[]): UserStats['problemsByType'] {
    const types = ['machineCoding', 'systemDesign', 'dsa', 'theory'];
    const result: UserStats['problemsByType'] = {
      machineCoding: 0,
      systemDesign: 0,
      dsa: 0,
      theory: 0,
    };

    types.forEach(type => {
      result[type as keyof UserStats['problemsByType']] = 
        progress.filter((p: any) => p.problemType === type).length;
    });

    return result;
  }
}
