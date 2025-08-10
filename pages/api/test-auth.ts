import { NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest, getUserIdFromHeader } from '@/lib/auth';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user ID from the authenticated request (original way)
    const userId = req.userId;
    
    // Get user ID from headers (new way)
    const userIdFromHeader = getUserIdFromHeader(req);
    
    if (!userId) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please provide a valid Bearer token or session cookie'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Authentication is working correctly',
      userId: userId,
      userIdFromHeader: userIdFromHeader,
      headers: {
        'authorization': req.headers.authorization ? 'Bearer [token]' : 'Not provided',
        'session-cookie': req.cookies?.session ? 'Present' : 'Not provided',
        'x-user-id': req.headers['x-user-id'] || 'Not set'
      }
    });
  } catch (error) {
    console.error('Test auth error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default withAuth(handler); 