import { NextApiRequest, NextApiResponse } from 'next';
import { evaluateMockInterviewSubmission } from '@/services/ai/evaluation';
import { MockInterviewProblem, MockInterviewSubmission } from '@/types/problem';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problem, submission } = req.body;

    if (!problem || !submission) {
      return res.status(400).json({
        error: 'Missing required fields: problem and submission are required',
      });
    }

    const evaluation = await evaluateMockInterviewSubmission(
      problem as MockInterviewProblem,
      submission as MockInterviewSubmission
    );

    res.status(200).json(evaluation);
  } catch (error) {
    console.error('Error evaluating mock interview submission:', error);
    res.status(500).json({
      error: 'Failed to evaluate mock interview submission',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
