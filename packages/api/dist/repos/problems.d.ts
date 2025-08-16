import { Problem } from '@workspace/schemas';
export type ListOptions = {
    limit?: number;
    cursor?: string;
};
export declare class ProblemRepo {
    private readonly col;
    create(problem: Problem): Promise<Problem>;
    getById(requesterUid: string | null, id: string): Promise<Problem>;
    listForUser(uid: string, { limit, cursor }?: ListOptions): Promise<Problem[]>;
    listAdminPublic({ limit, cursor }?: ListOptions): Promise<Problem[]>;
    update(requesterUid: string, patch: Partial<Problem> & {
        id: string;
    }): Promise<Problem>;
    remove(requesterUid: string, id: string): Promise<void>;
}
