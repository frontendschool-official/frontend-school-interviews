import type { NextApiResponse } from 'next';
import type { NextApiRequest } from 'next';
import '@/lib/firebase-admin';
import { SimulationRepo, verifyAuth } from '@workspace/api';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid } = await verifyAuth(req);
    const repo = new SimulationRepo();
    const simulations = await repo.listForUser(uid, { limit: 1 });
    const activeSimulation = simulations.find(s => s.status === 'active') || null;
    
    res.status(200).json(activeSimulation);
  } catch (error) {
    console.error('Error fetching active interview simulation:', error);
    res
      .status(500)
      .json({ error: 'Error fetching active interview simulation' });
  }
}

export default handler;
