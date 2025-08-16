import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';

const userProfileSchema = z.object({
  id: z.string(),
  uid: z.string(),
  email: z.string().email().optional(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  onboardingCompleted: z.boolean().default(false),
  streak: z.number().default(0),
  longestStreak: z.number().default(0),
  lastActiveDate: z.number().optional(),
  preferences: z.record(z.any()).optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

export class UserProfileRepo {
  private readonly col = getFirestore().collection('user_profiles');

  async getById(uid: string): Promise<UserProfile | null> {
    const doc = await this.col.doc(uid).get();
    if (!doc.exists) return null;
    return userProfileSchema.parse(doc.data());
  }

  async create(data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const now = Date.now();
    const profile = {
      ...data,
      id: data.uid,
      createdAt: now,
      updatedAt: now,
    };
    const validated = userProfileSchema.parse(profile);
    await this.col.doc(data.uid).set(validated);
    return validated;
  }

  async update(uid: string, patch: Partial<UserProfile>): Promise<UserProfile> {
    const existing = await this.getById(uid);
    if (!existing) {
      throw new Error('User profile not found');
    }
    const updated = {
      ...existing,
      ...patch,
      updatedAt: Date.now(),
    };
    const validated = userProfileSchema.parse(updated);
    await this.col.doc(uid).set(validated);
    return validated;
  }

  async updateStreak(uid: string, streak: number): Promise<void> {
    await this.col.doc(uid).update({
      streak,
      lastActiveDate: Date.now(),
      updatedAt: Date.now(),
    });
  }

  async completeOnboarding(uid: string): Promise<void> {
    await this.col.doc(uid).update({
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });
  }
}
