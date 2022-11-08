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
  const subtitle = [
    playedMs && `${formatter.formatMinutes(playedMs)} minutes`,
    streams && `${streams} streams`,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <Link legacyBehavior href={`/album/${album.id}`} passHref>
      <a className="block w-40 transition-transform duration-300 ease-in-out active:scale-95">
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
          <p className="m-0 truncate" title={subtitle}>
            {subtitle}
          </p>
        </div>
      </a>
    </Link>
  );
};
