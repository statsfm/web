import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  track: statsfm.Track;
  streams?: number;
  endTime?: Date;
}

export const TrackListRow = ({ track, streams, endTime }: Props) => {
  return (
    <>
      <Link
        href={`/track/${track.id}`}
        className="flex max-w-full items-center justify-between"
        passHref
      >
        <a className="flex justify-between">
          <div className="flex items-center gap-3">
            {track.albums[0]?.image && (
              <Image
                src={track.albums[0].image}
                alt={track.name}
                width={48}
                height={48}
              />
            )}

            <div className="truncate leading-tight">
              <h4 className="truncate">{track.name}</h4>
              <p className="m-0 truncate">
                {/* TODO: list all artist */}
                {track.artists[0]?.name} • {track.albums[0]?.name}
                {streams && ` • ${streams} streams`}
              </p>
            </div>
          </div>

          <p className="text-right">
            {endTime
              ? dayjs(endTime).fromNow()
              : dayjs.duration(track.durationMs, 'milliseconds').format('m:ss')}
          </p>
        </a>
      </Link>
      <hr className="my-3 border-foreground" />
    </>
  );
};
