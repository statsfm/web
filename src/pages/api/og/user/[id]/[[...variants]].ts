import { getApiInstance, getOrigin } from '@/utils/ssrUtils';
import { OpenGraphDefaultUser } from '@/components/OpenGraph/User/OpenGraphDefaultUser';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToImage } from '@/utils/satori';
import { DEFAULT_USER_IMAGE_URL } from '@/constants';
import { isFacebookURL } from '@/utils/urls';

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

  // prefetch image content to avoid satori inflightRequests cache memory leak
  // @see https://github.com/vercel/satori/issues/592#issuecomment-2293820464
  let userImageURL = user.image ?? DEFAULT_USER_IMAGE_URL;
  if (isFacebookURL(userImageURL)) {
    userImageURL = DEFAULT_USER_IMAGE_URL;
  }

  const origin = getOrigin(req);
  const userImageDownloadURL = `${origin}/api/image?url=${encodeURIComponent(userImageURL)}&w=512&q=75&f=image/png&fallbackImg=${DEFAULT_USER_IMAGE_URL}`;
  const userImageBase64 = await fetch(userImageDownloadURL)
    .then((res) => res.arrayBuffer())
    .then((content) => Buffer.from(content))
    .then((buff) => `data:image/png;base64,${buff.toString('base64')}`);

  const image = await renderToImage(
    OpenGraphDefaultUser(user, userImageBase64),
  );

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(image);
}
