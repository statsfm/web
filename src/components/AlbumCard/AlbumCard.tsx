import type { PropsWithChildren } from 'react';
import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from '@/utils/dayjs';

import Link from 'next/link';
import { Image } from '../Image';

interface Props extends Partial<statsfm.TopObject> {
  album: statsfm.Album | statsfm.AlbumSimple;
}

export const AlbumCard = ({
  album,
  playedMs,
  streams,
}: PropsWithChildren<Props>) => {
  return (
    <Link href={`/album/${album.id}`}>
      <div className="w-40">
        <div className="aspect-square w-full group-hover:opacity-90">
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
          <h4 className="line-clamp-2">{album.name}</h4>
          <p className="m-0 truncate">
            {playedMs &&
              `${Math.floor(
                dayjs.duration(playedMs, 'ms').asMinutes()
              ).toLocaleString()} minutes`}
            {streams && `• ${streams} streams`}
          </p>
        </div>
      </div>
    </Link>
  );
};
