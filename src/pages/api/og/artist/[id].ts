import { getApiInstance, getOrigin } from '@/utils/ssrUtils';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToImage } from '@/utils/satori';
import { OpenGraphDefaultArtist } from '@/components/OpenGraph/Artist/OpenGraphDefaultArtist';
import { DEFAULT_USER_IMAGE_URL } from '@/constants';
import { isFacebookURL } from '@/utils/urls';

export const runtime = 'nodejs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query as { id: string };

  const api = getApiInstance();
  const artist = await api.artists.get(parseInt(id, 10)).catch(() => {});
  if (!artist) {
    res.status(404).json({ error: 'Artist not found' });
    return;
  }

  // prefetch image content to avoid satori inflightRequests cache memory leak
  // @see https://github.com/vercel/satori/issues/592#issuecomment-2293820464
  let artistImageURL = artist.image ?? DEFAULT_USER_IMAGE_URL;
  if (isFacebookURL(artistImageURL)) {
    artistImageURL = DEFAULT_USER_IMAGE_URL;
  }

  const origin = getOrigin(req);
  const artistImageDownloadURL = `${origin}/api/image?url=${encodeURIComponent(artistImageURL)}&w=256&q=75&f=image/png&fallbackImg=${DEFAULT_USER_IMAGE_URL}`;
  const artistImageBase64 = await fetch(artistImageDownloadURL)
    .then((res) => res.arrayBuffer())
    .then((content) => Buffer.from(content))
    .then((buff) => `data:image/png;base64,${buff.toString('base64')}`);

  const image = await renderToImage(
    OpenGraphDefaultArtist(artist, artistImageBase64),
  );

  res.setHeader('Content-Type', 'image/png');
  res.send(image);
}
