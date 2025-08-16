import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { verifyAuth } from '@workspace/api';
import { z } from 'zod';

const evaluateSubmissionSchema = z.object({
  problem: z.record(z.any()),
  submission: z.record(z.any()),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await verifyAuth(req);
    const body = evaluateSubmissionSchema.parse(req.body);
    const { problem, submission } = body;

    // TODO: Implement evaluation service in @workspace/api
    // For now, return a placeholder evaluation
    const evaluation = {
      score: 75,
      feedback: 'Good attempt! Consider optimizing your solution further.',
      suggestions: ['Try to improve time complexity', 'Add edge case handling'],
      timestamp: Date.now(),
    };

    res.status(200).json(evaluation);
  } catch (error) {
    console.error('Error evaluating mock interview submission:', error);
    res.status(500).json({
      error: 'Failed to evaluate mock interview submission',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
