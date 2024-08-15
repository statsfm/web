import { getApiInstance } from '@/utils/ssrUtils';
import { OpenGraphDefaultUser } from '@/components/OpenGraph/User/OpenGraphDefaultUser';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToImage } from '@/utils/satori';

export const runtime = 'nodejs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as {
    id: string;
  };

  const api = getApiInstance();
  const user = await api.users.get(id).catch(() => {});
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (user.userBan?.active === true) {
    user.displayName = 'Banned User';
    if (user.profile?.bio) user.profile.bio = '';
    user.image = undefined;
    user.isPlus = false;
    user.customId = '';
  }

  const image = await renderToImage(OpenGraphDefaultUser(req, api, user));

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(image);
}
