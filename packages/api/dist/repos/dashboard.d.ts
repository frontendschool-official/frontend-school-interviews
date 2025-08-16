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
        dsa: {
            attempted: number;
            completed: number;
            averageScore: number;
        };
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
        theory: {
            attempted: number;
            completed: number;
            averageScore: number;
        };
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
export declare class DashboardRepo {
    private readonly progressRepo;
    private readonly profileRepo;
    private readonly problemRepo;
    getUserStats(uid: string): Promise<UserStats>;
    private getUserProgress;
    private calculateAverageScore;
    private calculatePerformanceByType;
    private calculateProblemsByDifficulty;
    private calculateProblemsByType;
}
