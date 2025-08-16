var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserProgressRepo } from './user-progress';
import { UserProfileRepo } from './user-profile';
import { ProblemRepo } from './problems';
export class DashboardRepo {
    constructor() {
        this.progressRepo = new UserProgressRepo();
        this.profileRepo = new UserProfileRepo();
        this.problemRepo = new ProblemRepo();
    }
    getUserStats(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch user progress and profile data in parallel
            const [userProgress, userProfile] = yield Promise.all([
                this.getUserProgress(uid),
                this.profileRepo.getById(uid),
            ]);
            if (!userProfile) {
                throw new Error('User profile not found');
            }
            // Calculate recent activity (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentActivity = userProgress.filter((progress) => {
                var _a, _b;
                const lastAttempted = ((_b = (_a = progress.lastAttemptedAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date(progress.lastAttemptedAt);
                return lastAttempted >= sevenDaysAgo;
            });
            // Calculate weekly stats
            const weeklyStats = {
                problemsAttempted: recentActivity.length,
                problemsCompleted: recentActivity.filter((p) => p.status === 'completed').length,
                timeSpent: recentActivity.reduce((total, p) => total + (p.timeSpent || 0), 0),
                averageScore: this.calculateAverageScore(recentActivity),
            };
            // Calculate performance by type
            const performanceByType = this.calculatePerformanceByType(userProgress);
            // Calculate overall stats
            const totalProblems = userProgress.length;
            const completedProblems = userProgress.filter((p) => p.status === 'completed').length;
            const totalTimeSpent = userProgress.reduce((total, p) => total + (p.timeSpent || 0), 0);
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
        });
    }
    getUserProgress(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement progress aggregation from UserProgressRepo
            // For now, return empty array - this would need to be implemented
            // by adding methods to UserProgressRepo to fetch aggregated progress
            return [];
        });
    }
    calculateAverageScore(progress) {
        const completedWithScores = progress.filter((p) => p.status === 'completed' && p.score !== undefined);
        if (completedWithScores.length === 0)
            return 0;
        const totalScore = completedWithScores.reduce((sum, p) => sum + p.score, 0);
        return totalScore / completedWithScores.length;
    }
    calculatePerformanceByType(progress) {
        const types = ['dsa', 'machineCoding', 'systemDesign', 'theory'];
        const result = {
            dsa: { attempted: 0, completed: 0, averageScore: 0 },
            machineCoding: { attempted: 0, completed: 0, averageScore: 0 },
            systemDesign: { attempted: 0, completed: 0, averageScore: 0 },
            theory: { attempted: 0, completed: 0, averageScore: 0 },
        };
        types.forEach(type => {
            const typeProgress = progress.filter((p) => p.problemType === type);
            const attempted = typeProgress.length;
            const completed = typeProgress.filter((p) => p.status === 'completed').length;
            const averageScore = this.calculateAverageScore(typeProgress);
            result[type] = {
                attempted,
                completed,
                averageScore,
            };
        });
        return result;
    }
    calculateProblemsByDifficulty(progress) {
        const difficulties = ['easy', 'medium', 'hard'];
        const result = {
            easy: 0,
            medium: 0,
            hard: 0,
        };
        difficulties.forEach(difficulty => {
            result[difficulty] =
                progress.filter((p) => p.difficulty === difficulty).length;
        });
        return result;
    }
    calculateProblemsByType(progress) {
        const types = ['machineCoding', 'systemDesign', 'dsa', 'theory'];
        const result = {
            machineCoding: 0,
            systemDesign: 0,
            dsa: 0,
            theory: 0,
        };
        types.forEach(type => {
            result[type] =
                progress.filter((p) => p.problemType === type).length;
        });
        return result;
    }
}
