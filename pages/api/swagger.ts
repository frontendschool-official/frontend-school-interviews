import { NextApiRequest, NextApiResponse } from 'next';
import swaggerSpec from '../../lib/swagger';

/**
 * @swagger
 * /api/swagger:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI specification for the API
 *     tags:
 *       - Documentation
 *     responses:
 *       200:
 *         description: OpenAPI specification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(swaggerSpec);
}
