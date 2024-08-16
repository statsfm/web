/* eslint-disable jsx-a11y/alt-text */
import { Logo } from '@/components/Logo';
import formatter from '@/utils/formatter';
import type { Artist } from '@/utils/statsfm';
import type { JSXElementConstructor, ReactElement } from 'react';

export function OpenGraphDefaultArtist(
  artist: Artist,
  artistImageBase64: string,
): ReactElement<JSXElementConstructor<unknown>> {
  return (
    <div tw="flex flex-col flex-1 w-full h-full bg-[#18181c]">
      <div tw="flex flex-row m-auto pl-32 pr-32">
        <div tw="flex">
          <img
            tw="rounded-full"
            height="400px"
            width="400px"
            src={artistImageBase64}
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
