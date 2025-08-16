import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { SimulationRepo, verifyAuth } from '@workspace/api';
import { z } from 'zod';

const createSimulationSchema = z.object({
  companyName: z.string().min(1),
  roleLevel: z.string().min(1),
  companyId: z.string().optional(),
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    const body = createSimulationSchema.parse(req.body);
    const { companyName, roleLevel, companyId } = body;

    const repo = new SimulationRepo();
    const simulation = await repo.create({
      ownerId: uid,
      companyName,
      roleLevel,
      companyId,
    });

    res.status(201).json({
      success: true,
      simulationId: simulation.id,
      message: 'Interview simulation created successfully',
    });
  } catch (error) {
    console.error('Error creating interview simulation:', error);
    res.status(500).json({
      error: 'Failed to create interview simulation',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export default handler;
