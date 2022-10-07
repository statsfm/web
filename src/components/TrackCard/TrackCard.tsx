import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from '@/utils/dayjs';
import { Image } from '@/components/Image';
import Link from 'next/link';

interface Props extends Partial<Omit<statsfm.TopTrack, 'track'>> {
  track: statsfm.Track;
}

export const TrackCard = ({ track, playedMs, streams, position }: Props) => {
  // TODO: move to util function
  const minutes = Math.floor(
    dayjs.duration(playedMs!, 'ms').asMinutes()
  ).toLocaleString();

  return (
    <div className="flex w-40 flex-col">
      <Link href={`/track/${track.id}`} passHref>
        <a>
          <div className="aspect-square w-full group-hover:opacity-90">
            {track.albums[0]?.image && (
              <Image
                src={track.albums[0].image}
                alt={track.name}
                width={160}
                height={160}
              />
            )}
          </div>
          <h4 className="mt-2 line-clamp-2">
            {position}. {track.name}
          </h4>
        </a>
      </Link>

      <p className="m-0 line-clamp-2">
        {playedMs && <span>{minutes} minutes • </span>}
        {streams && <span>{streams} streams • </span>}
        <span>
          {track.artists.map((artist, i) => (
            <span key={artist.id + i}>
              <Link href={`/artist/${artist.id}`}>
                <a className="transition-colors hover:text-white">
                  {artist.name}
                </a>
              </Link>

              {i !== track.artists.length - 1 && ', '}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
};
