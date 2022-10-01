import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import type { ForwardedRef, MutableRefObject } from 'react';
import { useMemo } from 'react';
import { MdMusicOff } from 'react-icons/md';
import { TrackListRow } from '../TrackListRow';

type Props<T extends statsfm.Stream | statsfm.RecentlyPlayedTrack> = {
  sectionRef?: ForwardedRef<HTMLElement>;
} & (T extends statsfm.Stream
  ? {
      streams: T[];
      track?: statsfm.Track;
    }
  : {
      streams: T[];
      track?: undefined;
    });

export const RecentStreams = <
  T extends statsfm.Stream | statsfm.RecentlyPlayedTrack
>({
  streams,
  track,
  sectionRef,
}: Props<T>) => {
  const pairs: Record<string, T[]> = {};

  // TODO: rewrite this to a useeffect
  streams.forEach((stream) => {
    const key = dayjs(stream.endTime).format('YYYYMMDD');

    if (!pairs[key]) pairs[key] = [];
    pairs[key]?.push(stream as T);
  });

  const ribbonOffset = useMemo(() => {
    // TODO: add proper types
    return (sectionRef as MutableRefObject<HTMLElement>)?.current?.clientHeight;
  }, [sectionRef]);

  if (!streams)
    <div className="grid w-full place-items-center">
      <MdMusicOff />
      <p className="m-0 text-text-grey">
        Looks like you don&apos;t have any recent streams
      </p>
    </div>;

  // TODO: sectionRef should not be directly the header of the section
  return (
    <ul>
      {Object.entries(pairs)
        .sort((a, b) => {
          if (a[0] > b[0]) return -1;
          if (a[0] < b[0]) return 1;
          return 0;
        })
        .map((streams, i) => (
          <div key={`recentStreams-${i}`}>
            <p
              className="sticky z-30 bg-background py-2"
              style={{ top: `${ribbonOffset - 1}px` }}
            >
              {dayjs(streams[1][0]!.endTime).format('LL')}
            </p>

            <li key={i}>
              <ul key={i}>
                {streams[1].map((stream, i) => (
                  <li key={i}>
                    {/* TODO: fix type */}
                    <TrackListRow
                      track={(stream as any).track ?? track}
                      {...stream}
                    />
                  </li>
                ))}
              </ul>
            </li>
          </div>
        ))}
    </ul>
  );
};

// TODO: add loading state
// (
//   Array(10)
//     .fill(null)
//     .map((_n, i) => (
//       <li key={i}>
//         <TrackListRowSkeleton />
//       </li>
//     ))
// )
