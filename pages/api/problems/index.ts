import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { ProblemRepo } from '@workspace/api';
import { problemSchema, problemSourceEnum, visibilityEnum } from '@workspace/schemas';
import { createId, nowUnixMs, AppError } from '@workspace/utils';
import { verifyAuthHeader } from '@workspace/api';

const repo = new ProblemRepo();

function parseBool(value: string | string[] | undefined): boolean | undefined {
  if (typeof value !== 'string') return undefined;
  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;
  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const mine = parseBool(req.query.mine);
      const visibility = typeof req.query.visibility === 'string' ? req.query.visibility : undefined;

      if (mine) {
        const token = await verifyAuthHeader(req.headers.authorization);
        const items = await repo.listForUser(token.uid, { limit: 20 });
        return res.status(200).json(items);
      }

      if (visibility === 'admin' || visibility === 'public') {
        const items = await repo.listAdminPublic({ limit: 20 });
        const filtered = visibility ? items.filter((p) => p.visibility === visibility) : items;
        return res.status(200).json(filtered);
      }

      // Default: admin + public
      const items = await repo.listAdminPublic({ limit: 20 });
      return res.status(200).json(items);
    }

    if (req.method === 'POST') {
      const token = await verifyAuthHeader(req.headers.authorization);
      const isAdmin = token.role === 'admin';
      const body = req.body ?? {};
      const now = nowUnixMs();
      const candidate = {
        ...body,
        id: body?.id ?? createId(),
        schemaVersion: '1.0.0',
        createdAt: body?.createdAt ?? now,
        updatedAt: now,
      };

      if (!isAdmin) {
        candidate.ownerId = token.uid;
        candidate.source = problemSourceEnum.enum.direct;
        candidate.visibility = visibilityEnum.enum.private;
      }

      const valid = problemSchema.parse(candidate);
      const saved = await repo.create(valid);
      return res.status(201).json(saved);
    }

    res.setHeader('Allow', 'GET, POST');
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

