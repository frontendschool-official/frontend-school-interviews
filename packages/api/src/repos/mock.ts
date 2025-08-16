import { getFirestore } from 'firebase-admin/firestore';
import { AppError } from '@workspace/utils';

export type MockInterview = {
  id: string;
  ownerId: string;
  problemIds: string[];
  createdAt: number;
  updatedAt: number;
};

export class MockRepo {
  private readonly col = getFirestore().collection('mock_interviews');

  async create(doc: MockInterview): Promise<MockInterview> {
    await this.col.doc(doc.id).set(doc);
    return doc;
  }

  async getById(requesterUid: string, id: string): Promise<MockInterview> {
    const snap = await this.col.doc(id).get();
    if (!snap.exists)
      throw new AppError('NOT_FOUND', 'Mock interview not found');
    const data = snap.data() as MockInterview;
    if (data.ownerId !== requesterUid)
      throw new AppError('FORBIDDEN', 'Not allowed');
    return data;
  }

  async listForUser(uid: string): Promise<MockInterview[]> {
    const snap = await this.col.where('ownerId', '==', uid).get();
    return snap.docs.map(d => d.data() as MockInterview);
  }
}
