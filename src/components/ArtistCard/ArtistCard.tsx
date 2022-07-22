import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from '@/utils/dayjs';

// components
import Link from 'next/link';
import { Avatar } from '../Avatar';

interface Props extends statsfm.TopArtist {}

export const ArtistCard = ({ playedMs, streams, artist }: Props) => {
  const minutes = Math.floor(
    dayjs.duration(playedMs!, 'ms').asMinutes()
  ).toLocaleString();

  return (
    <Link href={`/artist/${artist.id}`}>
      <div className="flex w-40 flex-col items-center">
        {artist.image && (
          <Avatar src={artist.image} name={artist.name} size="3xl" />
        )}

        <div className="mt-2 text-center">
          <h4>{artist.name}</h4>
          <p className="m-0 leading-tight line-clamp-2">
            <span>
              {playedMs && <span>{minutes} minutes • </span>}
              <span>{streams} streams</span>
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};
