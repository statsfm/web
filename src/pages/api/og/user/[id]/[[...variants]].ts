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

  if (user.userBan?.active === true) {
    user.displayName = 'Banned User';
    if (user.profile?.bio) user.profile.bio = '';
    user.image = undefined;
    user.isPlus = false;
    user.customId = '';
  }

  if (
    user.image === null ||
    user.image === undefined ||
    ['fbcdn', 'fbsbx'].some((s) => user.image!.includes(s))
  )
    user.image =
      'https://cdn.stats.fm/file/statsfm/images/placeholders/users/private.webp';

  const image = await renderToImage(
    VARIANTS[variants ?? 'default']!(req, api, user),
  );

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(image);
}
