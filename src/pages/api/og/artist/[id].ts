import { getApiInstance } from '@/utils/ssrUtils';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToImage } from '@/utils/satori';
import { OpenGraphDefaultArtist } from '@/components/OpenGraph/Artist/OpenGraphDefaultArtist';
import { defaultUserImageURL } from '@/contants';

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

  if (
    artist.image === null ||
    artist.image === undefined ||
    ['fbcdn', 'fbsbx'].some((s) => artist.image!.includes(s))
  ) {
    artist.image = defaultUserImageURL;
  }

  const image = await renderToImage(
    OpenGraphDefaultArtist(req, api, artist),
    // {
    //   debug: true,
    //   width: 1200,
    //   height: 600,
    // }
  );

  res.setHeader('Content-Type', 'image/png');
  res.send(image);
}
