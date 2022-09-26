import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import { useMemo, useRef } from 'react';
import { MdMusicOff } from 'react-icons/md';
import { Section } from '../Section';
import { TrackListRow } from '../TrackListRow';

type Props<T extends statsfm.Stream | statsfm.RecentlyPlayedTrack> = {
  title?: string;
  description?: string;
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
  title,
  description,
}: Props<T>) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pairs: Record<string, T[]> = {};

  // TODO: rewrite this to a useeffect
  streams.forEach((stream) => {
    const key = dayjs(stream.endTime).format('YYYYMMDD');

    if (!pairs[key]) pairs[key] = [];
    pairs[key]?.push(stream as T);
  });

  const ribbonOffset = useMemo(() => {
    return sectionRef.current?.clientHeight ?? 110;
  }, [sectionRef.current]);

  // TODO: sectionRef should not be directly the header of the section
  return (
    <Section
      title={title ?? ''}
      description={description}
      ref={sectionRef}
      headerStyle="!z-40"
    >
      {streams ? (
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
      ) : (
        <div className="grid w-full place-items-center">
          <MdMusicOff />
          <p className="m-0 text-text-grey">
            Looks like you don&apos;t have any recent streams
          </p>
        </div>
      )}
    </Section>
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
