import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemRepo, verifyAuth } from '@workspace/api';
import { problemSchema, problemSourceEnum, visibilityEnum } from '@workspace/schemas';
import { createId, nowUnixMs } from '@workspace/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problemData } = req.body ?? {};
    if (!problemData || typeof problemData !== 'object') {
      return res.status(400).json({ error: 'problemData is required' });
    }

    const token = await verifyAuth(req);
    const now = nowUnixMs();
    const candidate = {
      ...problemData,
      id: problemData?.id ?? createId(),
      schemaVersion: '1.0.0',
      ownerId: token.uid,
      source: problemSourceEnum.enum.direct,
      visibility: visibilityEnum.enum.private,
      createdAt: problemData?.createdAt ?? now,
      updatedAt: now,
    };
    const valid = problemSchema.parse(candidate);
    const repo = new ProblemRepo();
    const saved = await repo.create(valid);
    res.status(200).json({ success: true, data: saved });
  } catch (error) {
    console.error('Error saving interview problem:', error);
    res.status(500).json({
      error: 'Failed to save interview problem',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
