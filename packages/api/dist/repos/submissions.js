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
export class SubmissionsRepo {
    constructor() {
        this.col = getFirestore().collection('submissions');
    }
    getByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.where('userId', '==', userId).get();
            return snap.docs.map(d => d.data());
        });
    }
    save(userId, problemId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const id = `${userId}__${problemId}`;
            yield this.col.doc(id).set({
                id,
                userId,
                problemId,
                data,
                createdAt: now,
                updatedAt: now,
            }, { merge: true });
        });
    }
}
