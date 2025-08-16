import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

const roadmapSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.number(),
  companies: z.array(z.string()),
  designation: z.string(),
  overview: z.object({
    totalProblems: z.number(),
    totalTime: z.string(),
    focusAreas: z.array(z.string()),
    learningObjectives: z.array(z.string()),
  }),
  dailyPlan: z.array(z.object({
    day: z.number(),
    title: z.string(),
    description: z.string(),
    problems: z.array(z.object({
      title: z.string(),
      description: z.string(),
      type: z.enum(['dsa', 'machine_coding', 'system_design', 'theory_and_debugging']),
      difficulty: z.enum(['easy', 'medium', 'hard']),
      estimatedTime: z.string(),
      focusAreas: z.array(z.string()),
      learningObjectives: z.array(z.string()),
    })),
    totalTime: z.string(),
    focusAreas: z.array(z.string()),
  })),
  tips: z.array(z.string()),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Roadmap = z.infer<typeof roadmapSchema>;

export class RoadmapRepo {
  private readonly col = getFirestore().collection('roadmaps');

  async create(data: Omit<Roadmap, 'id' | 'createdAt' | 'updatedAt'>): Promise<Roadmap> {
    const now = Date.now();
    const id = data.ownerId + '__' + now;
    const roadmap = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const validated = roadmapSchema.parse(roadmap);
    await this.col.doc(id).set(validated);
    return validated;
  }

  async getById(requesterUid: string, id: string): Promise<Roadmap> {
    const doc = await this.col.doc(id).get();
    if (!doc.exists) {
      throw new Error('Roadmap not found');
    }
    const data = roadmapSchema.parse(doc.data());
    if (data.ownerId !== requesterUid) {
      throw new Error('Access denied');
    }
    return data;
  }

  async listForUser(uid: string): Promise<Roadmap[]> {
    const snap = await this.col.where('ownerId', '==', uid).orderBy('createdAt', 'desc').get();
    return snap.docs.map(d => roadmapSchema.parse(d.data()));
  }

  async update(requesterUid: string, id: string, patch: Partial<Roadmap>): Promise<Roadmap> {
    const existing = await this.getById(requesterUid, id);
    const updated = {
      ...existing,
      ...patch,
      updatedAt: Date.now(),
    };
    const validated = roadmapSchema.parse(updated);
    await this.col.doc(id).set(validated);
    return validated;
  }
}
