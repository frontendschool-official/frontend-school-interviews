import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemRepo } from '@workspace/api';
import { problemSchema } from '@workspace/schemas';
import { AppError, nowUnixMs } from '@workspace/utils';
import { verifyAuthHeader } from '@workspace/api';

const repo = new ProblemRepo();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing id' });

    if (req.method === 'GET') {
      const auth = req.headers.authorization ? await verifyAuthHeader(req.headers.authorization) : { uid: null };
      const item = await repo.getById((auth as any).uid ?? null, id);
      return res.status(200).json(item);
    }

    if (req.method === 'PATCH') {
      const token = await verifyAuthHeader(req.headers.authorization);
      const patch = { ...req.body, id, updatedAt: nowUnixMs() };
      // Validate patch by merging server-side
      const current = await repo.getById(token.uid, id);
      const merged = problemSchema.parse({ ...current, ...patch });
      const updated = await repo.update(token.uid, merged);
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const token = await verifyAuthHeader(req.headers.authorization);
      await repo.remove(token.uid, id);
      return res.status(204).end();
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: unknown) {
    if (e instanceof AppError) {
      if (e.code === 'UNAUTHENTICATED') return res.status(401).json({ error: e.code, message: e.message });
      if (e.code === 'FORBIDDEN') return res.status(403).json({ error: e.code, message: e.message });
      if (e.code === 'NOT_FOUND') return res.status(404).json({ error: e.code, message: e.message });
    }
    // eslint-disable-next-line no-console
    console.error(e);
    return res.status(500).json({ error: 'INTERNAL', message: 'Unexpected error' });
  }
}

