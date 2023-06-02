import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ message: 'Healthy' });
};

export default handler;
