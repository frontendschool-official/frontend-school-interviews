import type { NextApiRequest } from 'next';
export type DecodedToken = {
    uid: string;
    role?: 'admin' | 'user';
};
export declare const verifyAuthHeader: (authorization?: string) => Promise<DecodedToken>;
export declare const verifyAuth: (req: NextApiRequest) => Promise<DecodedToken>;
export declare const requireAdmin: (token: DecodedToken) => void;
