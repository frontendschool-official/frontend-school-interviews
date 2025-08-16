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
import { AppError, nowUnixMs } from '@workspace/utils';
import { problemSchema, visibilityEnum } from '@workspace/schemas';
export class ProblemRepo {
    constructor() {
        this.col = getFirestore().collection('problems');
    }
    create(problem) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsed = problemSchema.parse(problem);
            yield this.col.doc(parsed.id).set(parsed);
            return parsed;
        });
    }
    getById(requesterUid, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.doc(id).get();
            if (!snap.exists)
                throw new AppError('NOT_FOUND', 'Problem not found');
            const data = problemSchema.parse(snap.data());
            const canRead = (data.ownerId && requesterUid && data.ownerId === requesterUid) ||
                data.visibility === visibilityEnum.enum.admin ||
                data.visibility === visibilityEnum.enum.public;
            if (!canRead)
                throw new AppError('FORBIDDEN', 'Not allowed to read this problem');
            return data;
        });
    }
    listForUser(uid_1) {
        return __awaiter(this, arguments, void 0, function* (uid, { limit = 20, cursor } = {}) {
            let q = this.col
                .where('ownerId', '==', uid)
                .orderBy('createdAt', 'desc')
                .limit(limit);
            if (cursor) {
                const curSnap = yield this.col.doc(cursor).get();
                if (curSnap.exists)
                    q = q.startAfter(curSnap);
            }
            const snap = yield q.get();
            return snap.docs.map(d => problemSchema.parse(d.data()));
        });
    }
    listAdminPublic() {
        return __awaiter(this, arguments, void 0, function* ({ limit = 20, cursor } = {}) {
            let q = this.col
                .where('visibility', 'in', ['admin', 'public'])
                .orderBy('createdAt', 'desc')
                .limit(limit);
            if (cursor) {
                const curSnap = yield this.col.doc(cursor).get();
                if (curSnap.exists)
                    q = q.startAfter(curSnap);
            }
            const snap = yield q.get();
            return snap.docs.map(d => problemSchema.parse(d.data()));
        });
    }
    update(requesterUid, patch) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.doc(patch.id).get();
            if (!snap.exists)
                throw new AppError('NOT_FOUND', 'Problem not found');
            const existing = problemSchema.parse(snap.data());
            const isOwner = existing.ownerId === requesterUid;
            if (!isOwner)
                throw new AppError('FORBIDDEN', 'Only owner can update');
            const merged = Object.assign(Object.assign(Object.assign({}, existing), patch), { updatedAt: nowUnixMs() });
            const parsed = problemSchema.parse(merged);
            yield this.col.doc(parsed.id).set(parsed);
            return parsed;
        });
    }
    remove(requesterUid, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.doc(id).get();
            if (!snap.exists)
                return;
            const existing = problemSchema.parse(snap.data());
            const isOwner = existing.ownerId === requesterUid;
            if (!isOwner)
                throw new AppError('FORBIDDEN', 'Only owner can delete');
            yield this.col.doc(id).delete();
        });
    }
}
