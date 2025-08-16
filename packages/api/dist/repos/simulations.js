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
import { AppError, createId } from '@workspace/utils';
export class SimulationRepo {
    constructor() {
        this.col = getFirestore().collection('simulations');
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = Date.now();
            const simulation = Object.assign(Object.assign({}, data), { id: createId(), problemIds: [], status: 'active', createdAt: now, updatedAt: now });
            yield this.col.doc(simulation.id).set(simulation);
            return simulation;
        });
    }
    getById(requesterUid, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.doc(id).get();
            if (!snap.exists)
                throw new AppError('NOT_FOUND', 'Simulation not found');
            const data = snap.data();
            if (data.ownerId !== requesterUid)
                throw new AppError('FORBIDDEN', 'Not allowed');
            return data;
        });
    }
    appendProblems(requesterUid, id, problemIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.doc(id).get();
            if (!snap.exists)
                throw new AppError('NOT_FOUND', 'Simulation not found');
            const data = snap.data();
            if (data.ownerId !== requesterUid)
                throw new AppError('FORBIDDEN', 'Not allowed');
            yield this.col.doc(id).update({
                problemIds: [...data.problemIds, ...problemIds],
                updatedAt: Date.now(),
            });
        });
    }
    listForUser(uid, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let q = this.col.where('ownerId', '==', uid).orderBy('createdAt', 'desc');
            if (options === null || options === void 0 ? void 0 : options.limit) {
                q = q.limit(options.limit);
            }
            const snap = yield q.get();
            return snap.docs.map(d => d.data());
        });
    }
}
