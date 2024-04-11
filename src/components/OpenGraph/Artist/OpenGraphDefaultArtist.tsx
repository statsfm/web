/* eslint-disable jsx-a11y/alt-text */
import { Logo } from '@/components/Logo';
import formatter from '@/utils/formatter';
import { getOrigin } from '@/utils/ssrUtils';
import type { Artist } from '@/utils/statsfm';
import type Api from '@statsfm/statsfm.js';
import type { NextApiRequest } from 'next';
import type { JSXElementConstructor, ReactElement } from 'react';

export function OpenGraphDefaultArtist(
  req: NextApiRequest,
  _: Api,
  artist: Artist,
): ReactElement<JSXElementConstructor<any>> {
  const origin = getOrigin(req);

  return (
    <div tw="flex flex-col flex-1 w-full h-full bg-[#18181c]">
      <div tw="flex flex-row m-auto pl-32 pr-32">
        <div tw="flex">
          <img
            tw="rounded-full"
            height="400px"
            width="400px"
            src={`${origin}/api/image?url=${artist.image}&w=256&q=75&f=image/png`}
          />
        </div>
        <div
          style={{ whiteSpace: 'nowrap' }}
          tw="flex m-auto flex-col text-white ml-10 w-[600px]"
        >
          <h1
            style={{
              fontFamily: 'Sans Bold',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
            tw="text-6xl text-[#1ed760] mt-10"
          >
            {artist.name}
          </h1>
          <h1
            style={{ whiteSpace: 'pre-line', fontFamily: 'Sans Medium' }}
            tw="text-4xl"
          >
            {formatter.localiseNumber(artist.followers)} followers
          </h1>
        </div>
      </div>
      <div tw="absolute bottom-0 flex items-center text-white ml-5">
        <Logo tw="h-8 w-8 mr-3" />
        <div tw="flex items-end">
          <h2 tw="text-[#A3A3A3] mb-5" style={{ fontFamily: 'Sans Medium' }}>
            stats.fm
          </h2>
        </div>
      </div>
    </div>
  );
}
