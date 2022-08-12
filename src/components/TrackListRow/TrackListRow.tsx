import Link from 'next/link';
import type * as statsfm from '@statsfm/statsfm.js';
import { Image } from '@/components/Image';
import dayjs from '@/utils/dayjs';

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
        <a>
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              {track.albums[0]?.image && (
                <Image
                  width={48}
                  height={48}
                  alt={track.name}
                  src={track.albums[0]?.image}
                />
              )}

              <div className="truncate leading-tight">
                <h4 className="truncate">{track.name}</h4>
                <p className="m-0 truncate">
                  {/* TODO: list all artist */}
                  {track.artists[0]?.name} • {track.albums[0]?.name}
                  {streams !== undefined && ` • ${streams}x streamed`}
                </p>
              </div>
            </div>

            <p className="text-right">
              {endTime
                ? dayjs(endTime).fromNow()
                : dayjs
                    .duration(track.durationMs, 'milliseconds')
                    .format('m:ss')}
            </p>
          </div>

          <hr className="my-3 border-foreground" />
        </a>
      </Link>
    </>
  );
};
