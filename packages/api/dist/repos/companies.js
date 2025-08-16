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
const companySchema = z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string(),
    description: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    industry: z.string().optional(),
    founded: z.number().optional(),
    headquarters: z.string().optional(),
    website: z.string().url().optional(),
    createdAt: z.number(),
    updatedAt: z.number(),
});
export class CompaniesRepo {
    constructor() {
        this.col = getFirestore().collection('companies');
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.orderBy('name').get();
            return snap.docs.map(d => companySchema.parse(d.data()));
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const snap = yield this.col.orderBy('name').get();
            const companies = snap.docs.map(d => companySchema.parse(d.data()));
            const searchTerm = query.toLowerCase();
            return companies.filter(company => {
                var _a;
                return company.name.toLowerCase().includes(searchTerm) ||
                    company.description.toLowerCase().includes(searchTerm) ||
                    ((_a = company.industry) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm));
            });
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.col.doc(id).get();
            if (!doc.exists)
                return null;
            return companySchema.parse(doc.data());
        });
    }
    getDesignations() {
        return __awaiter(this, void 0, void 0, function* () {
            // This would typically come from a separate designations collection
            // For now, return common frontend designations
            return [
                'Frontend Engineer',
                'Frontend Developer',
                'React Developer',
                'JavaScript Developer',
                'UI Developer',
                'Web Developer',
                'Frontend Lead',
                'Senior Frontend Engineer',
                'Staff Frontend Engineer',
            ];
        });
    }
}
