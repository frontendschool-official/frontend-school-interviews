import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from 'firebase-admin';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
}

export type ApiHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

export function withAuth(handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get the authorization header
      const authHeader = req.headers.authorization;
      console.log(authHeader, "authHeader");
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If no auth header, try to get user ID from cookies (for SSR)
        const sessionCookie = req.cookies?.session;
        
        if (sessionCookie) {
          try {
            const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
            console.log(decodedClaims, "decodedClaims");
            req.userId = decodedClaims.uid;
          } catch (error) {
            console.error('Error verifying session cookie:', error);
          }
        }
      } else {
        // Extract the token from the Authorization header
        const token = authHeader.split('Bearer ')[1];
        console.log(token, "token");
        if (token) {
          try {
            // Verify the Firebase ID token
            const decodedToken = await auth().verifyIdToken(token);
            console.log(decodedToken, "decodedToken");
            req.userId = decodedToken.uid;
          } catch (error) {
            console.error('Error verifying ID token:', error);
          }
        }
      }

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('withAuth error:', error);
      
      // If there's an error with authentication, continue without user ID
      // This allows the API route to handle authentication errors appropriately
      return handler(req, res);
    }
  };
}

// Optional: Create a version that requires authentication
export function withRequiredAuth(handler: ApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get the authorization header
      const authHeader = req.headers.authorization;
      console.log("Auth headers:", req.headers.authorization ? "Bearer token present" : "No Bearer token");
      console.log("Session cookie:", req.cookies?.session ? "Present" : "Not present");
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // If no auth header, try to get user ID from cookies (for SSR)
        const sessionCookie = req.cookies?.session;
        
        if (sessionCookie) {
          try {
            const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
            req.userId = decodedClaims.uid;
          } catch (error) {
            console.error('Error verifying session cookie:', error);
          }
        }
      } else {
        // Extract the token from the Authorization header
        const token = authHeader.split('Bearer ')[1];
        
        if (token) {
          try {
            // Verify the Firebase ID token
            const decodedToken = await auth().verifyIdToken(token);
            req.userId = decodedToken.uid;
          } catch (error) {
            console.error('Error verifying ID token:', error);
          }
        }
      }
      console.log("req.userId", req.userId);
      // Check if user is authenticated
      if (!req.userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('withRequiredAuth error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Helper functions to extract user ID from request
export function getUserIdFromRequest(req: AuthenticatedRequest): string | null {
  return req.userId || null;
}

export function requireUserIdFromRequest(req: AuthenticatedRequest): string {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    throw new Error('User ID not found in request');
  }
  return userId;
}

export function hasUserIdInRequest(req: AuthenticatedRequest): boolean {
  return !!req.userId;
} 