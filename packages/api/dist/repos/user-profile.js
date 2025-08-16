var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export class UserProfileRepo {
    constructor() {
        this.col = getFirestore().collection('user_profiles');
    }
    getById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.col.doc(uid).get();
            if (!doc.exists)
                return null;
            return userProfileSchema.parse(doc.data());
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const profile = Object.assign(Object.assign({}, data), { id: data.uid, createdAt: now, updatedAt: now });
            const validated = userProfileSchema.parse(profile);
            yield this.col.doc(data.uid).set(validated);
            return validated;
        });
    }
    update(uid, patch) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.getById(uid);
            if (!existing) {
                throw new Error('User profile not found');
            }
            const updated = Object.assign(Object.assign(Object.assign({}, existing), patch), { updatedAt: Date.now() });
            const validated = userProfileSchema.parse(updated);
            yield this.col.doc(uid).set(validated);
            return validated;
        });
    }
    updateStreak(uid, streak) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.col.doc(uid).update({
                streak,
                lastActiveDate: Date.now(),
                updatedAt: Date.now(),
            });
        });
    }
    completeOnboarding(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.col.doc(uid).update({
                onboardingCompleted: true,
                updatedAt: Date.now(),
            });
        });
    }
}
