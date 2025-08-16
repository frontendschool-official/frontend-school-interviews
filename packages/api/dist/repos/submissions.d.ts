export type Submission = {
    id: string;
    userId: string;
    problemId: string;
    data: unknown;
    createdAt: number;
    updatedAt: number;
};
export declare class SubmissionsRepo {
    private readonly col;
    getByUser(userId: string): Promise<Submission[]>;
    save(userId: string, problemId: string, data: unknown): Promise<void>;
}
