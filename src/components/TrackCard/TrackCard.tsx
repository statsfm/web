import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from '@/utils/dayjs';
import Image from 'next/image';
import Link from 'next/link';

interface Props extends Partial<Omit<statsfm.TopTrack, 'track'>> {
  track: statsfm.Track;
}

export const TrackCard = ({ track, playedMs, streams }: Props) => {
  // TODO: move to util function
  const minutes = Math.floor(
    dayjs.duration(playedMs!, 'ms').asMinutes()
  ).toLocaleString();

  return (
    <Link href={`/track/${track.id}`}>
      <div className="w-40">
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
        <div className="mt-2">
          <h4 className="line-clamp-2">{track.name}</h4>
          <p className="m-0 line-clamp-2">
            {playedMs && <span>{minutes} minutes • </span>}
            {streams && <span>{streams} streams • </span>}
            <span>
              {track.artists.map((artist, i) => (
                <Link href={`/artist/${artist.id}`} key={i}>
                  {artist.name}
                </Link>
              ))}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};
