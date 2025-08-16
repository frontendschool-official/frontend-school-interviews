import { getFirestore } from 'firebase-admin/firestore';

export class UserProgressRepo {
  private readonly attemptsCol = getFirestore().collection('attempts');
  private readonly feedbackCol = getFirestore().collection('feedback');

  async markAttempted(
    userId: string,
    problemId: string,
    attemptData: unknown
  ): Promise<void> {
    const now = Date.now();
    const id = `${userId}__${problemId}`;
    await this.attemptsCol.doc(id).set(
      {
        id,
        userId,
        problemId,
        attemptData,
        status: 'attempted',
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    );
  }

  async markCompleted(
    userId: string,
    problemId: string,
    score: number,
    timeSpent: number
  ): Promise<void> {
    const now = Date.now();
    const id = `${userId}__${problemId}`;
    await this.attemptsCol.doc(id).set(
      {
        id,
        userId,
        problemId,
        status: 'completed',
        score,
        timeSpent,
        updatedAt: now,
      },
      { merge: true }
    );
  }

  async saveFeedback(
    userId: string,
    problemId: string,
    feedbackData: unknown
  ): Promise<void> {
    const now = Date.now();
    const id = `${userId}__${problemId}__${now}`;
    await this.feedbackCol
      .doc(id)
      .set({ id, userId, problemId, feedbackData, createdAt: now });
  }
}
