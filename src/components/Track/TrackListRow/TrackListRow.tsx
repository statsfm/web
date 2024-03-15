import Link from 'next/link';
import type * as statsfm from '@/utils/statsfm';
import { Image } from '@/components/Image';
import dayjs from '@/utils/dayjs';
import { Divider } from '@/components/Divider';

interface Props {
  track?: statsfm.Track;

  // when passing a stream object
  trackId?: number;
  trackName?: string;

  streams?: number;
  endTime?: Date;
  playedMs?: number;
}

export const TrackListRow = ({
  track,
  trackId,
  trackName,
  streams,
  endTime,
  playedMs,
}: Props) => {
  const artists =
    track && track.artists.map((artist) => artist.name).join(', ');
  const album = track && track.albums[0]?.name;
  const streamCount = streams !== undefined ? `${streams}x streamed` : null;
  const playedFor = playedMs
    ? `listened for ${dayjs(playedMs).format('m:ss')}`
    : null;

  return (
    <>
      <Link
        legacyBehavior
        href={`/track/${track ? track.id : trackId}`}
        className="flex max-w-full items-center justify-between"
        passHref
      >
        <a>
          <div className="flex justify-between">
            <div className="flex w-10/12 items-center gap-3">
              {track && track.albums[0]?.image && (
                <Image
                  width={48}
                  height={48}
                  alt={track.name}
                  src={track.albums[0]?.image}
                />
              )}

              <div className="w-9/12 truncate leading-tight">
                <h4 className="truncate">{track ? track.name : trackName}</h4>
                <p className="m-0 truncate">
                  {[artists, album, streamCount, playedFor]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              </div>
            </div>

            <p
              className="m-0 text-right"
              title={
                endTime && dayjs(endTime).format('dddd, D MMMM YYYY HH:mm')
              }
            >
              {endTime
                ? dayjs(endTime).fromNow()
                : dayjs
                    .duration(track?.durationMs ?? 0, 'milliseconds')
                    .format('m:ss')}
            </p>
          </div>

          <Divider />
        </a>
      </Link>
    </>
  );
};
