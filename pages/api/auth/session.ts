import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from 'firebase-admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Get the ID token from the request body
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: 'ID token is required' });
      }

      // Verify the ID token
      const decodedToken = await auth().verifyIdToken(idToken);

      // Create a session cookie
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });

      // Set the session cookie
      res.setHeader(
        'Set-Cookie',
        `session=${sessionCookie}; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn}; Path=/`
      );

      return res.status(200).json({
        success: true,
        message: 'Session cookie created successfully',
        userId: decodedToken.uid,
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
