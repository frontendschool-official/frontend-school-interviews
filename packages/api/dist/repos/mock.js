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
import { AppError } from '@workspace/utils';
export class MockRepo {
    constructor() {
        this.col = getFirestore().collection('mock_interviews');
    }
    create(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.col.doc(doc.id).set(doc);
            return doc;
        });
    }
    getById(requesterUid, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.doc(id).get();
            if (!snap.exists)
                throw new AppError('NOT_FOUND', 'Mock interview not found');
            const data = snap.data();
            if (data.ownerId !== requesterUid)
                throw new AppError('FORBIDDEN', 'Not allowed');
            return data;
        });
    }
    listForUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.where('ownerId', '==', uid).get();
            return snap.docs.map(d => d.data());
        });
    }
}
