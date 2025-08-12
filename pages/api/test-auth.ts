import { NextApiResponse } from 'next';
import {
  withAuth,
  AuthenticatedRequest,
  getUserIdFromRequest,
} from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from the authenticated request (original way)
    const userId = req.userId;

    // Get user ID from request (new way)
    const userIdFromRequest = getUserIdFromRequest(req);

    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid Bearer token or session cookie',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Authentication is working correctly',
      userId: userId,
      userIdFromRequest: userIdFromRequest,
      headers: {
        authorization: req.headers.authorization
          ? 'Bearer [token]'
          : 'Not provided',
        'session-cookie': req.cookies?.session ? 'Present' : 'Not provided',
        'x-user-id': 'Removed - using req.userId instead',
      },
    });
  } catch (error) {
    console.error('Test auth error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withAuth(handler);
