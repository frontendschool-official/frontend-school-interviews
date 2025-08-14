import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAuth } from '@/lib/firebase-admin';
import { getUserProfile } from '@/services/firebase/user-profile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Check if session cookie exists and is valid
      const sessionCookie = req.cookies?.session;

      if (!sessionCookie) {
        return res.status(401).json({
          authenticated: false,
          message: 'No session cookie found',
        });
      }

      // Verify the session cookie
      const decodedClaims = await firebaseAuth.verifySessionCookie(
        sessionCookie,
        true
      );

      // Get user profile data
      const userProfile = await getUserProfile(decodedClaims.uid);

      if (!userProfile) {
        return res.status(404).json({
          authenticated: false,
          error: 'User profile not found',
          message: 'User profile does not exist',
        });
      }

      // Return critical user profile data with session (private)
      res.setHeader('Cache-Control', 'private, no-store');
      return res.status(200).json({
        authenticated: true,
        userId: decodedClaims.uid,
        userProfile: {
          uid: userProfile.uid,
          email: userProfile.email,
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL,
          isPremium: userProfile.isPremium,
          subscriptionStatus: userProfile.subscriptionStatus,
          onboardingCompleted: userProfile.onboardingCompleted,
          preferences: userProfile.preferences,
          stats: userProfile.stats,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt,
          lastLoginAt: userProfile.lastLoginAt,
        },
        message: 'Session is valid',
      });
    } catch (error) {
      console.error('Error verifying session cookie:', error);
      return res.status(401).json({
        authenticated: false,
        error: 'Invalid session cookie',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else if (req.method === 'POST') {
    try {
      // Get the ID token from the request body
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
      }

      // Verify the ID token
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);

      // Check if user profile exists
      const userProfile = await getUserProfile(decodedToken.uid);

      if (!userProfile) {
        return res.status(404).json({
          error: 'User profile not found',
          message:
            'User profile does not exist. Please complete onboarding first.',
        });
      }

      // Create a session cookie (only once after login)
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await firebaseAuth.createSessionCookie(idToken, {
        expiresIn,
      });

      // Set the session cookie
      res.setHeader(
        'Set-Cookie',
        `session=${sessionCookie}; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn}; Path=/`
      );

      // Return critical user profile data with session creation
      res.setHeader('Cache-Control', 'private, no-store');
      return res.status(200).json({
        success: true,
        message: 'Session cookie created successfully',
        userId: decodedToken.uid,
        userProfile: {
          uid: userProfile.uid,
          email: userProfile.email,
          displayName: userProfile.displayName,
          photoURL: userProfile.photoURL,
          isPremium: userProfile.isPremium,
          subscriptionStatus: userProfile.subscriptionStatus,
          onboardingCompleted: userProfile.onboardingCompleted,
          preferences: userProfile.preferences,
          stats: userProfile.stats,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt,
          lastLoginAt: userProfile.lastLoginAt,
        },
      });
    } catch (error) {
      console.error('Error creating session cookie:', error);
      return res.status(401).json({
        error: 'Failed to create session cookie',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  } else if (req.method === 'DELETE') {
    // Clear the session cookie
    res.setHeader(
      'Set-Cookie',
      'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
    );

    return res.status(200).json({
      success: true,
      message: 'Session cookie cleared successfully',
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
