var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppError } from '@workspace/utils';
import { getAuth } from 'firebase-admin/auth';
export const verifyAuthHeader = (authorization) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authorization)
        throw new AppError('UNAUTHENTICATED', 'Missing Authorization header');
    const token = authorization.replace(/^Bearer\s+/i, '').trim();
    if (!token)
        throw new AppError('UNAUTHENTICATED', 'Missing bearer token');
    const decoded = yield getAuth().verifyIdToken(token);
    const role = decoded.role;
    return { uid: decoded.uid, role: role !== null && role !== void 0 ? role : 'user' };
});
export const verifyAuth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // Try header-based auth first (new method)
    if (req.headers.authorization) {
        return verifyAuthHeader(req.headers.authorization);
    }
    // Fall back to session-based auth (legacy method)
    if (req.userId) {
        return { uid: req.userId, role: 'user' };
    }
    throw new AppError('UNAUTHENTICATED', 'No valid authentication found');
});
export const requireAdmin = (token) => {
    if (token.role !== 'admin')
        throw new AppError('FORBIDDEN', 'Admin privileges required');
};
