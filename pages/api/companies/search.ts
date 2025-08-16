import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/firebase-admin';
import { CompaniesRepo } from '@workspace/api';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { searchQuery } = req.query;

    if (!searchQuery || typeof searchQuery !== 'string') {
      return res.status(400).json({ error: 'Query parameter "searchQuery" is required' });
    }

    const repo = new CompaniesRepo();
    const companies = await repo.search(searchQuery);

    res.status(200).json(companies);
  } catch (error) {
    console.error('Error searching companies:', error);
    res.status(500).json({ error: 'Error searching companies' });
  }
}
