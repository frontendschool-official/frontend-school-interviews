import { NextApiRequest, NextApiResponse } from 'next';
import { verifySessionCookie } from '@/lib/firebase-admin';

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
}

export type ApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

// Helper functions to extract user ID from headers (set by middleware)
export function getUserIdFromHeader(req: NextApiRequest): string | null {
  return (req.headers['x-user-id'] as string) || null;
}

export function requireUserIdFromHeader(req: NextApiRequest): string {
  const userId = getUserIdFromHeader(req);
  if (!userId) {
    throw new Error('User ID not found in request headers');
  }
  return userId;
}

export function hasUserIdInHeader(req: NextApiRequest): boolean {
  return !!req.headers['x-user-id'];
}

// Legacy helper functions for backward compatibility
export function getUserIdFromRequest(req: AuthenticatedRequest): string | null {
  return req.userId || getUserIdFromHeader(req);
}

export function requireUserIdFromRequest(req: AuthenticatedRequest): string {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    throw new Error('User ID not found in request');
  }
  return userId;
}

export function hasUserIdInRequest(req: AuthenticatedRequest): boolean {
  return !!req.userId || hasUserIdInHeader(req);
}

// Middleware wrapper that extracts user ID from headers (set by Next.js middleware)
export function withAuth(handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get user ID from headers (set by middleware)
      const userId = getUserIdFromHeader(req);
      if (userId) {
        req.userId = userId;
      }

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('withAuth error:', error);
      return handler(req, res);
    }
  };
}

// Middleware wrapper that requires authentication
export function withRequiredAuth(handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // First try to get user ID from headers (set by middleware)
      let userId = getUserIdFromHeader(req);

      // If not in headers, try to verify session cookie directly
      if (!userId) {
        const sessionCookie = req.cookies?.session;
        if (sessionCookie) {
          userId = await verifySessionCookie(sessionCookie);
        }
      }

      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      req.userId = userId;

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('withRequiredAuth error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
