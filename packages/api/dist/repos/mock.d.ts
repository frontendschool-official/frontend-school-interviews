export type MockInterview = {
    id: string;
    ownerId: string;
    problemIds: string[];
    createdAt: number;
    updatedAt: number;
};
export declare class MockRepo {
    private readonly col;
    create(doc: MockInterview): Promise<MockInterview>;
    getById(requesterUid: string, id: string): Promise<MockInterview>;
    listForUser(uid: string): Promise<MockInterview[]>;
}
