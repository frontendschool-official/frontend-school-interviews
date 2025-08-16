import { getFirestore } from 'firebase-admin/firestore';

export type Submission = {
  id: string;
  userId: string;
  problemId: string;
  data: unknown;
  createdAt: number;
  updatedAt: number;
};

export class SubmissionsRepo {
  private readonly col = getFirestore().collection('submissions');

  async getByUser(userId: string): Promise<Submission[]> {
    const snap = await this.col.where('userId', '==', userId).get();
    return snap.docs.map(d => d.data() as Submission);
  }

  async save(userId: string, problemId: string, data: unknown): Promise<void> {
    const now = Date.now();
    const id = `${userId}__${problemId}`;
    await this.col.doc(id).set(
      {
        id,
        userId,
        problemId,
        data,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  }
}

