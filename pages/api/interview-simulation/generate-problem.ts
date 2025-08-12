import { NextApiRequest, NextApiResponse } from 'next';
import { generateMockInterviewProblem } from '@/services/ai/evaluation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { roundType, companyName, roleLevel, difficulty } = req.body;

    if (!roundType || !companyName || !roleLevel) {
      return res.status(400).json({
        error:
          'Missing required fields: roundType, companyName, and roleLevel are required',
      });
    }

    const problem = await generateMockInterviewProblem(
      roundType,
      companyName,
      roleLevel,
      difficulty || 'medium'
    );

    res.status(200).json(problem);
  } catch (error) {
    console.error('Error generating mock interview problem:', error);
    res.status(500).json({
      error: 'Failed to generate mock interview problem',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
