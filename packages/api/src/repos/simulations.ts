import { getFirestore } from 'firebase-admin/firestore';
import { AppError, createId } from '@workspace/utils';

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

export class SimulationRepo {
  private readonly col = getFirestore().collection('simulations');

  async create(data: Omit<Simulation, 'id' | 'createdAt' | 'updatedAt' | 'problemIds' | 'status'>): Promise<Simulation> {
    const now = Date.now();
    const simulation = {
      ...data,
      id: createId(),
      problemIds: [],
      status: 'active' as const,
      createdAt: now,
      updatedAt: now,
    };
    await this.col.doc(simulation.id).set(simulation);
    return simulation;
  }

  async getById(requesterUid: string, id: string): Promise<Simulation> {
    const snap = await this.col.doc(id).get();
    if (!snap.exists) throw new AppError('NOT_FOUND', 'Simulation not found');
    const data = snap.data() as Simulation;
    if (data.ownerId !== requesterUid)
      throw new AppError('FORBIDDEN', 'Not allowed');
    return data;
  }

  async appendProblems(
    requesterUid: string,
    id: string,
    problemIds: string[]
  ): Promise<void> {
    const snap = await this.col.doc(id).get();
    if (!snap.exists) throw new AppError('NOT_FOUND', 'Simulation not found');
    const data = snap.data() as Simulation;
    if (data.ownerId !== requesterUid)
      throw new AppError('FORBIDDEN', 'Not allowed');
    await this.col.doc(id).update({
      problemIds: [...data.problemIds, ...problemIds],
      updatedAt: Date.now(),
    });
  }

  async listForUser(uid: string, options?: { limit?: number }): Promise<Simulation[]> {
    let q = this.col.where('ownerId', '==', uid).orderBy('createdAt', 'desc');
    if (options?.limit) {
      q = q.limit(options.limit);
    }
    const snap = await q.get();
    return snap.docs.map(d => d.data() as Simulation);
  }
}
