import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { UserProfileRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    const repo = new UserProfileRepo();
    
    // Get current profile to calculate new streak
    const profile = await repo.getById(uid);
    const currentStreak = profile?.streak || 0;
    const newStreak = currentStreak + 1;
    
    await repo.updateStreak(uid, newStreak);

    res.status(200).json({
      success: true,
      message: 'User streak updated successfully',
    });
  } catch (error) {
    console.error('Error updating user streak:', error);
    res.status(500).json({
      error: 'Failed to update user streak',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
