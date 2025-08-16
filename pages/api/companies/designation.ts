import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { CompaniesRepo, verifyAuth } from '@workspace/api';
import { z } from 'zod';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      await verifyAuth(req);
      const { companyId, designations } = req.body;

      if (!companyId || !designations) {
        return res
          .status(400)
          .json({ error: 'companyId and designation are required' });
      }

      // TODO: Implement company designation management
      res.status(200).json({ message: 'Designation added to company' });
    } else if (req.method === 'GET') {
      const { companyId } = req.query;
      if (!companyId) {
        return res.status(400).json({ error: 'companyId is required' });
      }

      const repo = new CompaniesRepo();
      const designations = await repo.getDesignations();
      res.status(200).json(designations);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling designation:', error);
    res.status(500).json({ error: 'Error handling designation' });
  }
}

export default handler;
