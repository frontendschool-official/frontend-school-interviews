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
export class RoadmapRepo {
    constructor() {
        this.col = getFirestore().collection('roadmaps');
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const id = data.ownerId + '__' + now;
            const roadmap = Object.assign(Object.assign({}, data), { id, createdAt: now, updatedAt: now });
            const validated = roadmapSchema.parse(roadmap);
            yield this.col.doc(id).set(validated);
            return validated;
        });
    }
    getById(requesterUid, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.col.doc(id).get();
            if (!doc.exists) {
                throw new Error('Roadmap not found');
            }
            const data = roadmapSchema.parse(doc.data());
            if (data.ownerId !== requesterUid) {
                throw new Error('Access denied');
            }
            return data;
        });
    }
    listForUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.where('ownerId', '==', uid).orderBy('createdAt', 'desc').get();
            return snap.docs.map(d => roadmapSchema.parse(d.data()));
        });
    }
    update(requesterUid, id, patch) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.getById(requesterUid, id);
            const updated = Object.assign(Object.assign(Object.assign({}, existing), patch), { updatedAt: Date.now() });
            const validated = roadmapSchema.parse(updated);
            yield this.col.doc(id).set(validated);
            return validated;
        });
    }
}
