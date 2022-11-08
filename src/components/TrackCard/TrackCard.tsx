import type * as statsfm from '@statsfm/statsfm.js';
import { Image } from '@/components/Image';
import Link from 'next/link';
import formatter from '@/utils/formatter';

interface Props extends Partial<Omit<statsfm.TopTrack, 'track'>> {
  track: statsfm.Track;
}

export const TrackCard = ({ track, playedMs, streams, position }: Props) => {
  const subtitle = [
    playedMs && `${formatter.formatMinutes(playedMs)} minutes`,
    streams && `${streams} streams`,
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <div className="flex w-40 flex-col transition-transform duration-300 ease-in-out active:scale-95">
      <Link legacyBehavior href={`/track/${track.id}`} passHref>
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
            {position && `${position}.`} {track.name}
          </h4>
        </a>
      </Link>

      <p className="m-0 line-clamp-2" title={subtitle}>
        {subtitle}
        {subtitle && ' • '}
        <span>
          {track.artists.map((artist, i) => (
            <span key={artist.id + i}>
              <Link legacyBehavior href={`/artist/${artist.id}`}>
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
