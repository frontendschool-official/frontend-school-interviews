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
    
    // Check if user profile already exists
    const existingProfile = await repo.getById(uid);
    if (existingProfile) {
      return res.status(200).json({
        message: 'User already exists',
        userId: uid,
      });
    }

    // Create new user profile
    const profile = await repo.create({
      uid,
      onboardingCompleted: false,
      streak: 0,
      longestStreak: 0,
    });

    res.status(201).json({
      message: 'User created',
      userId: uid,
      profile,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
}

export default handler;
