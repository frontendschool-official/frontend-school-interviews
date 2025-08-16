import { z } from 'zod';
declare const userProfileSchema: z.ZodObject<{
    id: z.ZodString;
    uid: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    displayName: z.ZodOptional<z.ZodString>;
    photoURL: z.ZodOptional<z.ZodString>;
    onboardingCompleted: z.ZodDefault<z.ZodBoolean>;
    streak: z.ZodDefault<z.ZodNumber>;
    longestStreak: z.ZodDefault<z.ZodNumber>;
    lastActiveDate: z.ZodOptional<z.ZodNumber>;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    uid: string;
    createdAt: number;
    id: string;
    updatedAt: number;
    onboardingCompleted: boolean;
    streak: number;
    longestStreak: number;
    email?: string | undefined;
    displayName?: string | undefined;
    photoURL?: string | undefined;
    lastActiveDate?: number | undefined;
    preferences?: Record<string, any> | undefined;
}, {
    uid: string;
    createdAt: number;
    id: string;
    updatedAt: number;
    email?: string | undefined;
    displayName?: string | undefined;
    photoURL?: string | undefined;
    onboardingCompleted?: boolean | undefined;
    streak?: number | undefined;
    longestStreak?: number | undefined;
    lastActiveDate?: number | undefined;
    preferences?: Record<string, any> | undefined;
}>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export declare class UserProfileRepo {
    private readonly col;
    getById(uid: string): Promise<UserProfile | null>;
    create(data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile>;
    update(uid: string, patch: Partial<UserProfile>): Promise<UserProfile>;
    updateStreak(uid: string, streak: number): Promise<void>;
    completeOnboarding(uid: string): Promise<void>;
}
export {};
