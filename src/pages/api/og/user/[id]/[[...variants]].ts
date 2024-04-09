import { getApiInstance } from '@/utils/ssrUtils';
import type { ReactElement, JSXElementConstructor } from 'react';
import type { UserPublic } from '@statsfm/statsfm.js';
import type Api from '@statsfm/statsfm.js';
import { OpenGraphDefaultUser } from '@/components/OpenGraph/User/OpenGraphDefaultUser';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToImage } from '@/utils/satori';

export const runtime = 'nodejs';

type OGUserHandler = (
  req: NextApiRequest,
  api: Api,
  user: UserPublic,
) => ReactElement<JSXElementConstructor<any>>;

const VARIANTS: Record<string, OGUserHandler> = {
  default: OpenGraphDefaultUser,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, variants } = req.query as { id: string; variants: string };

  const api = getApiInstance();
  const user = await api.users.get(id).catch(() => {});
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const image = await renderToImage(
    VARIANTS[variants ?? 'default']!(req, api, user),
    // {
    //   debug: true,
    //   width: 1200,
    //   height: 600,
    // },
  );

  res.setHeader('Content-Type', 'image/png');
  res.send(image);
}
