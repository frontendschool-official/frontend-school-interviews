import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemGenerator, verifyAuth } from '@workspace/api';
import { z } from 'zod';

const generateProblemSchema = z.object({
  roundType: z.string().min(1),
  companyName: z.string().min(1),
  roleLevel: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
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
    const body = generateProblemSchema.parse(req.body);
    const { roundType, companyName, roleLevel, difficulty } = body;

    const generator = new ProblemGenerator();
    const problem = await generator.generate({
      kind: roundType as any,
      role: roleLevel,
      company: companyName,
      difficulty: difficulty || 'medium',
      context: `Interview for ${roleLevel} at ${companyName}`,
    });

    res.status(200).json(problem);
  } catch (error) {
    console.error('Error generating mock interview problem:', error);
    res.status(500).json({
      error: 'Failed to generate mock interview problem',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
