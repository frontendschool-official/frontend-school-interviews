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
export class UserProgressRepo {
    constructor() {
        this.attemptsCol = getFirestore().collection('attempts');
        this.feedbackCol = getFirestore().collection('feedback');
    }
    markAttempted(userId, problemId, attemptData) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const id = `${userId}__${problemId}`;
            yield this.attemptsCol.doc(id).set({
                id,
                userId,
                problemId,
                attemptData,
                status: 'attempted',
                updatedAt: now,
                createdAt: now,
            }, { merge: true });
        });
    }
    markCompleted(userId, problemId, score, timeSpent) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const id = `${userId}__${problemId}`;
            yield this.attemptsCol.doc(id).set({
                id,
                userId,
                problemId,
                status: 'completed',
                score,
                timeSpent,
                updatedAt: now,
            }, { merge: true });
        });
    }
    saveFeedback(userId, problemId, feedbackData) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const id = `${userId}__${problemId}__${now}`;
            yield this.feedbackCol
                .doc(id)
                .set({ id, userId, problemId, feedbackData, createdAt: now });
        });
    }
}
