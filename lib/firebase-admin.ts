import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { auth } from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Export the auth instance for use throughout the application
export const firebaseAuth = auth();

// Helper function to verify session cookie
export async function verifySessionCookie(
  sessionCookie: string
): Promise<string | null> {
  try {
    const decodedClaims = await firebaseAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

// Helper function to verify ID token
export async function verifyIdToken(
  idToken: string
): Promise<string | null> {
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}

// Helper function to create session cookie
export async function createSessionCookie(
  idToken: string,
  expiresIn: number
): Promise<string> {
  return await firebaseAuth.createSessionCookie(idToken, { expiresIn });
}
