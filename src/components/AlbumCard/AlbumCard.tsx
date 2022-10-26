import type { PropsWithChildren } from 'react';
import type * as statsfm from '@statsfm/statsfm.js';

import Link from 'next/link';
import formatter from '@/utils/formatter';
import { Image } from '../Image';

interface Props extends Partial<statsfm.TopObject> {
  album: statsfm.Album | statsfm.AlbumSimple;
}

export const AlbumCard = ({
  album,
  playedMs,
  streams,
  position,
}: PropsWithChildren<Props>) => {
  return (
    <Link href={`/album/${album.id}`} passHref>
      <a className="block w-40">
        <div className="w-full group-hover:opacity-90">
          {album.image && (
            <Image
              src={album.image}
              width={160}
              height={160}
              alt={album.name}
              className="aspect-square"
            />
          )}
        </div>
        <div className="mt-2">
          <h4 className="line-clamp-2">
            {position && `${position}.`} {album.name}
          </h4>
          <p className="m-0 truncate">
            {playedMs && `${formatter.formatMinutes(playedMs)} minutes`}
            {streams && `• ${streams} streams`}
          </p>
        </div>
      </a>
    </Link>
  );
};
