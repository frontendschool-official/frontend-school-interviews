import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { UserProfileRepo, verifyAuth } from '@workspace/api';
import { z } from 'zod';

const onboardingDataSchema = z.record(z.any());

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    const { onboardingData } = req.body;

    if (!onboardingData) {
      return res.status(400).json({
        error: 'Missing required field: onboardingData is required',
      });
    }

    const repo = new UserProfileRepo();
    await repo.completeOnboarding(uid);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({
      error: 'Failed to complete onboarding',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
