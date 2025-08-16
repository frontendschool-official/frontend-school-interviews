export declare class UserProgressRepo {
    private readonly attemptsCol;
    private readonly feedbackCol;
    markAttempted(userId: string, problemId: string, attemptData: unknown): Promise<void>;
    markCompleted(userId: string, problemId: string, score: number, timeSpent: number): Promise<void>;
    saveFeedback(userId: string, problemId: string, feedbackData: unknown): Promise<void>;
}
