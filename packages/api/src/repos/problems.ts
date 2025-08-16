import { getFirestore } from 'firebase-admin/firestore';
import { AppError, nowUnixMs } from '@workspace/utils';
import { Problem, problemSchema, visibilityEnum } from '@workspace/schemas';

export type ListOptions = { limit?: number; cursor?: string };

export class ProblemRepo {
  private readonly col = getFirestore().collection('problems');

  async create(problem: Problem): Promise<Problem> {
    const parsed = problemSchema.parse(problem);
    await this.col.doc(parsed.id).set(parsed);
    return parsed;
  }

  async getById(requesterUid: string | null, id: string): Promise<Problem> {
    const snap = await this.col.doc(id).get();
    if (!snap.exists) throw new AppError('NOT_FOUND', 'Problem not found');
    const data = problemSchema.parse(snap.data());
    const canRead =
      (data.ownerId && requesterUid && data.ownerId === requesterUid) ||
      data.visibility === visibilityEnum.enum.admin ||
      data.visibility === visibilityEnum.enum.public;
    if (!canRead)
      throw new AppError('FORBIDDEN', 'Not allowed to read this problem');
    return data;
  }

  async listForUser(
    uid: string,
    { limit = 20, cursor }: ListOptions = {}
  ): Promise<Problem[]> {
    let q = this.col
      .where('ownerId', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(limit);
    if (cursor) {
      const curSnap = await this.col.doc(cursor).get();
      if (curSnap.exists) q = q.startAfter(curSnap);
    }
    const snap = await q.get();
    return snap.docs.map(d => problemSchema.parse(d.data()));
  }

  async listAdminPublic({ limit = 20, cursor }: ListOptions = {}): Promise<
    Problem[]
  > {
    let q = this.col
      .where('visibility', 'in', ['admin', 'public'])
      .orderBy('createdAt', 'desc')
      .limit(limit);
    if (cursor) {
      const curSnap = await this.col.doc(cursor).get();
      if (curSnap.exists) q = q.startAfter(curSnap);
    }
    const snap = await q.get();
    return snap.docs.map(d => problemSchema.parse(d.data()));
  }

  async update(
    requesterUid: string,
    patch: Partial<Problem> & { id: string }
  ): Promise<Problem> {
    const snap = await this.col.doc(patch.id).get();
    if (!snap.exists) throw new AppError('NOT_FOUND', 'Problem not found');
    const existing = problemSchema.parse(snap.data());
    const isOwner = existing.ownerId === requesterUid;
    if (!isOwner) throw new AppError('FORBIDDEN', 'Only owner can update');
    const merged = { ...existing, ...patch, updatedAt: nowUnixMs() } as Problem;
    const parsed = problemSchema.parse(merged);
    await this.col.doc(parsed.id).set(parsed);
    return parsed;
  }

  async remove(requesterUid: string, id: string): Promise<void> {
    const snap = await this.col.doc(id).get();
    if (!snap.exists) return;
    const existing = problemSchema.parse(snap.data());
    const isOwner = existing.ownerId === requesterUid;
    if (!isOwner) throw new AppError('FORBIDDEN', 'Only owner can delete');
    await this.col.doc(id).delete();
  }
}
