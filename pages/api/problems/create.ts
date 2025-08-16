import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { verifyAuth, ProblemGenerator } from '@workspace/api';
import { problemSchema, problemSourceEnum, visibilityEnum } from '@workspace/schemas';
import { createId, nowUnixMs } from '@workspace/utils';
// TODO: wire to packages/api/gemini ProblemGenerator; placeholder echoes the request

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { designation, companies, round, interviewType, problem, kind, difficulty, context } = req.body ?? {};

    if (!designation || !companies || !round || !interviewType) {
      return res.status(400).json({
        error:
          'Missing required fields: designation, companies, round, and interviewType are required',
      });
    }

    const { uid: userId } = await verifyAuth(req);

    console.log('🚀 Starting interview generation with values:', {
      designation,
      companies,
      round,
      interviewType,
      userId,
    });

    // Prefer AI generation if no explicit problem provided
    let output = problem;
    if (!output) {
      const generator = new ProblemGenerator();
      output = await generator.generate({ kind, role: designation, company: companies, difficulty, context: context ?? round });
    }
    const now = nowUnixMs();
    const candidate = {
      ...output,
      id: output?.id ?? createId(),
      schemaVersion: '1.0.0',
      ownerId: userId,
      source: problemSourceEnum.enum.simulation,
      visibility: visibilityEnum.enum.private,
      createdAt: output?.createdAt ?? now,
      updatedAt: now,
    };
    const valid = problemSchema.parse(candidate);
    return res.status(200).json({ success: true, problem: valid });
  } catch (error) {
    console.error('❌ Error in create problems API:', error);

    let errorMessage = 'Failed to create problems';
    if (error instanceof Error) {
      errorMessage = error.message;

      // Check for specific error types
      if (error.message.includes('permission-denied')) {
        errorMessage =
          'Permission denied: Unable to save interview data. Please check your account permissions.';
      } else if (
        error.message.includes('network') ||
        error.message.includes('unavailable')
      ) {
        errorMessage =
          'Network error: Please check your internet connection and try again.';
      } else if (error.message.includes('Gemini API')) {
        errorMessage =
          'AI service error: Unable to generate interview questions. Please try again.';
      }
    }

    return res.status(500).json({
      error: errorMessage,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
