import { AppError } from '@workspace/utils';
import { getAuth } from 'firebase-admin/auth';
import type { NextApiRequest } from 'next';

export type DecodedToken = {
  uid: string;
  role?: 'admin' | 'user';
};

export const verifyAuthHeader = async (
  authorization?: string
): Promise<DecodedToken> => {
  if (!authorization)
    throw new AppError('UNAUTHENTICATED', 'Missing Authorization header');
  const token = authorization.replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new AppError('UNAUTHENTICATED', 'Missing bearer token');
  const decoded = await getAuth().verifyIdToken(token);
  const role = (decoded as any).role as 'admin' | 'user' | undefined;
  return { uid: decoded.uid, role: role ?? 'user' };
};

export const verifyAuth = async (
  req: NextApiRequest
): Promise<DecodedToken> => {
  // Try header-based auth first (new method)
  if (req.headers.authorization) {
    return verifyAuthHeader(req.headers.authorization);
  }

  // Fall back to session-based auth (legacy method)
  if ((req as any).userId) {
    return { uid: (req as any).userId, role: 'user' };
  }

  throw new AppError('UNAUTHENTICATED', 'No valid authentication found');
};

export const requireAdmin = (token: DecodedToken): void => {
  if (token.role !== 'admin')
    throw new AppError('FORBIDDEN', 'Admin privileges required');
};
