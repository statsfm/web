import type * as statsfm from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import type { RefObject } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { MdMusicOff } from 'react-icons/md';
import { TrackListRow, TrackListRowSkeleton } from '@/components/Track';

type Props<T extends statsfm.Stream | statsfm.RecentlyPlayedTrack> = {
  headerRef: RefObject<HTMLElement>;
  loading?: boolean | null; // loading can be null to opt out of loading behvaior and default error state
  onItemClick?: () => void;
  allowToChangeMatch?: boolean;
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
  headerRef,
  loading,
  onItemClick,
  allowToChangeMatch,
}: Props<T>) => {
  const [streamsByDate, setStreamsByData] = useState<[string, T[]][]>([]);

  useEffect(() => {
    // TODO: rewrite this to be more readable
    const pairs: Record<string, T[]> = {};

    streams.forEach((stream) => {
      const key = dayjs(stream.endTime).format('YYYYMMDD');

      if (!pairs[key]) pairs[key] = [];
      pairs[key]?.push(stream as T);
    });

    const sortedPairs = Object.entries(pairs).sort((a, b) => {
      if (a[0] > b[0]) return -1;
      if (a[0] < b[0]) return 1;
      return 0;
    });

    setStreamsByData(sortedPairs);
  }, [streams]);

  const ribbonOffset = useMemo(() => {
    return headerRef.current?.clientHeight ?? 0;
  }, [headerRef.current]);

  if (loading === false && streams.length === 0)
    return (
      <div className="grid w-full place-items-center py-20">
        <MdMusicOff />
        <p className="m-0 text-text-grey">
          Looks like you don&apos;t have any recent streams
        </p>
      </div>
    );
  return (
    <ul>
      {(loading === undefined || loading) && streamsByDate.length < 1
        ? Array(10)
            .fill(null)
            .map((_n, i) => (
              <li key={i}>
                <TrackListRowSkeleton />
              </li>
            ))
        : streamsByDate.map((streams, i) => {
            return (
              <div key={`recentStreams-${i}`}>
                <p
                  className="sticky z-[29] bg-background py-2"
                  style={{ top: `${ribbonOffset - 1}px` }}
                >
                  {dayjs(streams[1][0]!.endTime).format('LL')}
                </p>

                <li key={i}>
                  <ul key={i}>
                    {streams[1].map((stream, i) => {
                      return (
                        <li key={i} onClick={onItemClick}>
                          {/* TODO: fix type */}
                          <TrackListRow
                            allowToChangeMatch={allowToChangeMatch}
                            track={(stream as any).tracks ?? track}
                            {...stream}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </div>
            );
          })}
    </ul>
  );
};
