import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import { TrackListRow } from '../TrackListRow';

type Props<T extends statsfm.Stream | statsfm.RecentlyPlayedTrack> =
  T extends statsfm.Stream
    ? {
        streams: T[];
        track?: statsfm.Track;
      }
    : {
        streams: T[];
        track?: undefined;
      };

export const RecentStreams = <
  T extends statsfm.Stream | statsfm.RecentlyPlayedTrack
>({
  streams,
  track,
}: Props<T>) => {
  const pairs: Record<string, T[]> = {};

  streams.forEach((stream) => {
    const key = dayjs(stream.endTime).format('YYYYMMDD');

    if (!pairs[key]) pairs[key] = [];
    pairs[key]?.push(stream as T);
  });

  return (
    <ul>
      {Object.entries(pairs)
        .sort((a, b) => {
          if (a[0] > b[0]) return -1;
          if (a[0] < b[0]) return 1;
          return 0;
        })
        .map((streams, i) => (
          <>
            {/* don't hardcode header height */}
            <p className="sticky top-[121px] z-30 bg-background py-2">
              {dayjs(streams[1][0]!.endTime).format('LL')}
            </p>

            <li key={i}>
              <ul key={i}>
                {streams[1].map((stream, i) => (
                  <li key={i}>
                    {/* @ts-ignore TODO: fix type */}
                    <TrackListRow {...stream} track={stream.track ?? track} />
                  </li>
                ))}
              </ul>
            </li>
          </>
        ))}
    </ul>
  );
};
