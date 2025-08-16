export type Simulation = {
    id: string;
    ownerId: string;
    companyName: string;
    roleLevel: string;
    companyId?: string;
    problemIds: string[];
    status: 'active' | 'completed';
    createdAt: number;
    updatedAt: number;
};
export declare class SimulationRepo {
    private readonly col;
    create(data: Omit<Simulation, 'id' | 'createdAt' | 'updatedAt' | 'problemIds' | 'status'>): Promise<Simulation>;
    getById(requesterUid: string, id: string): Promise<Simulation>;
    appendProblems(requesterUid: string, id: string, problemIds: string[]): Promise<void>;
    listForUser(uid: string, options?: {
        limit?: number;
    }): Promise<Simulation[]>;
}
