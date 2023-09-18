import Link from 'next/link';
import type * as statsfm from '@statsfm/statsfm.js';
import { Image } from '@/components/Image';
import dayjs from '@/utils/dayjs';
import { Divider } from '@/components/Divider';

import { useState } from 'react';
import { useRouter } from 'next/router';

interface Props {
  allowToChangeMatch?: boolean;
  id?: string;
  platform?: string;
  track?: statsfm.Track;

  // when passing a stream object
  trackId?: number;
  trackName?: string;
  albumId?: number;

  streams?: number;
  endTime?: Date;
  playedMs?: number;
  service?: string;
}
const reqNewMatch = async (streamId: string, trackId: string) => {
  await fetch(
    `${process.env.API_URL}/imports/am/set-new-match/${streamId}/${trackId}`
  );
};
export const TrackListRow = ({
  allowToChangeMatch,
  id,
  track,
  platform,
  trackId,
  trackName,
  albumId,
  streams,
  endTime,
  playedMs,
}: Props) => {
  const router = useRouter();
  const [data, setData] = useState([1]);

  const MatchListRow = (i: any) => {
    // @ts-ignore
    const setNewMatch = (event) => {
      event.preventDefault();
      if (i.id && id) reqNewMatch(id, i.id);
      // track = i;
      setData([]);
      router.reload();
    };

    if (data.length > 1)
      return (
        <div>
          <span>
            {i?.artists?.length
              ? i.artists.map((a: { name: string }) => a.name).join(', ')
              : 'NONAME'}{' '}
            - {i.name}
            {i.albums?.length ? ` • ${i.albums[0].name}` : ''}
          </span>
          <button
            className="cursor-pointer rounded-lg bg-foreground px-4 py-1 font-semibold transition duration-200 hover:text-primary"
            onClick={setNewMatch}
          >
            Set Match
          </button>
        </div>
      );
    return <></>;
  };

  const fetchData = async () => {
    const req = await fetch(
      `${process.env.API_URL}/imports/am/change-match/${id}`
    );
    const newData = await req.json();

    if (!newData.length) return data[0] !== 123 ? setData([123]) : setData([]);
    return setData(newData);
  };
  // @ts-ignore
  const handleClick = (event) => {
    event.preventDefault();
    fetchData();
    // setData([1, 2]);
  };
  const artists =
    track?.artists?.length &&
    track.artists.map((artist) => artist.name).join(', ');
  const album =
    albumId && track?.albums?.length
      ? track?.albums.filter((a) => +a.id === +albumId)[0]
      : null;
  const streamCount = streams !== undefined ? `${streams}x streamed` : null;
  const playedFor = playedMs
    ? `listened for ${`0${Math.floor(playedMs / 60000) % 60}`.slice(-2)}:${`0${
        Math.floor(playedMs / 1000) % 60
      }`.slice(-2)}`
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
              {album && (
                <Image
                  width={48}
                  height={48}
                  alt={album.name}
                  src={album?.image}
                />
              )}

              <div className="w-9/12 truncate leading-tight">
                <h4 className="truncate">{track ? track.name : trackName}</h4>
                <p className="m-0 truncate">
                  {[artists, album?.name, streamCount, playedFor]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              </div>
            </div>
            {/* {service && service !== 'spotify' && streamId && <button>Change match</button>} */}
            {id &&
              allowToChangeMatch &&
              platform &&
              platform === 'appleMusic' && (
                <button
                  className="cursor-pointer rounded-lg bg-foreground px-4 py-1 font-semibold transition duration-200 hover:text-primary"
                  onClick={handleClick}
                >
                  Change match
                </button>
              )}
            <p
              className="m-0 flex items-center text-center"
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
      {data[0] === 123 ? (
        <h2>No alternatives</h2>
      ) : (
        data.map((i) => MatchListRow(i))
      )}
    </>
  );
};
TrackListRow.getInitialProps = async () => {
  // const req = await fetch('https://randomuser.me/api/?gender=female&results=10');
  const data = [1]; // await req.json();
  return { initialData: data };
};
