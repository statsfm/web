import type { GetServerSideProps, NextPage } from 'next';
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from '@/utils/dayjs';
import { MdMusicOff } from 'react-icons/md';

import { Image } from '@/components/Image';
import Head from 'next/head';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { useEffect, useState } from 'react';
import { TopListenerCardSkeleton } from '@/components/TopListenerCard';
import TopListenerCard from '@/components/TopListenerCard/TopListenerCard';
import { AlbumCard, AlbumCardSkeleton } from '@/components/AlbumCard';
import { TrackListRow } from '@/components/TrackListRow';

import { useApi } from '@/hooks';

interface Props {
  track: statsfm.Track;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = new statsfm.Api();

  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  const track = await api.tracks.get(parseInt(id, 10));

  return {
    props: {
      track,
    },
  };
};

const Track: NextPage<Props> = ({ track }) => {
  const api = useApi();

  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [recentStreams, setRecentStreams] = useState<Record<
    string,
    statsfm.Stream[]
  > | null>(null);

  useEffect(() => {
    (async () => {
      setTopListeners(
        await api.http
          .get<statsfm.TopUser[]>(`/tracks/${track.id}/top/listeners`)
          .then((res) => res.data.items)
      );

      const recentStreams = await api.users.trackStreams('martijn', track.id);

      if (recentStreams.length > 0) {
        const pairs: Record<string, statsfm.Stream[]> = {};

        recentStreams.forEach((stream) => {
          const key = dayjs(stream.endTime).format('YYYYMMDD');

          if (!pairs[key]) pairs[key] = [];
          pairs[key]?.push(stream);
        });

        setRecentStreams(pairs);
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{track.name}</title>
      </Head>

      <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
        {track.albums[0]?.image && (
          <Image
            src={track.albums[0].image}
            alt={track.name}
            width={192}
            height={192}
          />
        )}

        <div className="flex flex-col justify-end">
          <span className="text-center text-lg md:text-left">
            {track.artists.map((artist) => artist.name).join(', ')}
          </span>
          <h1 className="text-center md:text-left">{track.name}</h1>
        </div>
      </section>

      <Section
        title="Appears on"
        description={`Albums featuring ${track.name}`}
      >
        <Carousel gap={16} rows={1}>
          {track.albums.length > 0
            ? track.albums.map((item, i) => (
                <li key={i} className="w-max">
                  <AlbumCard album={item} />
                </li>
              ))
            : Array(10)
                .fill(null)
                .map((_n, i) => (
                  <li key={i}>
                    <AlbumCardSkeleton />
                  </li>
                ))}
        </Carousel>
      </Section>

      <Section
        title="Top listeners"
        description={`People who listen a lot to ${track.name}`}
      >
        <Carousel gap={16} rows={1}>
          {topListeners.length > 0
            ? topListeners.map((item, i) => (
                <li key={i}>
                  <TopListenerCard {...item} />
                </li>
              ))
            : Array(10)
                .fill(null)
                .map((_n, i) => (
                  <li key={i}>
                    <TopListenerCardSkeleton />
                  </li>
                ))}
        </Carousel>
      </Section>

      <Section title="Recent streams" description="Your recently played tracks">
        {recentStreams ? (
          <ul>
            {Object.entries(recentStreams)
              .sort((a, b) => {
                if (a[0] > b[0]) return -1;
                if (a[0] < b[0]) return 1;
                return 0;
              })
              .map((streams, i) => (
                <li key={i}>
                  {/* TODO: make the date sticky */}
                  <p>{dayjs(streams[1][0]!.endTime).format('LL')}</p>

                  <ul key={i}>
                    {streams[1].map((stream, i) => (
                      <li key={i}>
                        <TrackListRow {...stream} track={track} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        ) : (
          <div className="grid w-full place-items-center">
            <MdMusicOff />

            <p className="m-0 text-text-grey">
              Looks like you haven&apos;t listened to {track.name} yet
            </p>
          </div>
        )}
      </Section>
    </>
  );
};

export default Track;
