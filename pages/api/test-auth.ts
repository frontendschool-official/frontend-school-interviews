import { NextApiRequest, NextApiResponse } from 'next';
import { withRequiredAuth, AuthenticatedRequest } from '@/lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This will only be called if authentication passes
    const userId = req.userId;

    console.log('✅ Authentication test successful');
    console.log('User ID:', userId);
    console.log('Headers:', req.headers);

    res.status(200).json({
      success: true,
      message: 'Authentication working correctly',
      userId,
      headers: {
        'x-user-id': req.headers['x-user-id'],
        authorization: req.headers.authorization ? 'Present' : 'Not present',
        cookie: req.headers.cookie ? 'Present' : 'Not present',
      },
    });
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default withRequiredAuth(handler);
