import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import * as statsfm from '@statsfm/statsfm.js';
import { MdMusicOff } from 'react-icons/md';

import Head from 'next/head';
import Link from 'next/link';
import { Image } from '@/components/Image';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import TopListenerCard from '@/components/TopListenerCard/TopListenerCard';
import { TopListenerCardSkeleton } from '@/components/TopListenerCard';
import { RecentStreams } from '@/components/RecentStreams';

import { useApi } from '@/hooks';

interface Props {
  album: statsfm.Album;
  tracks: statsfm.Track[];
  streams: statsfm.Stream[];
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = new statsfm.Api();

  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  const album = await api.albums.get(parseInt(id, 10));
  const tracks = await api.albums.tracks(parseInt(id, 10));
  const streams = await api.users.albumStreams('martijn', album.id);

  return {
    props: {
      album,
      tracks,
      streams,
    },
  };
};

const Album: NextPage<Props> = ({ album, tracks, streams }) => {
  const api = useApi();
  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);

  useEffect(() => {
    (async () => {
      setTopListeners(
        await api.http
          .get<statsfm.TopUser[]>(`/albums/${album.id}/top/listeners`)
          .then((res) => res.data.items)
      );
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{album.name}</title>
      </Head>

      <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
        {album.image && (
          <Image src={album.image} alt={album.name} width={192} height={192} />
        )}

        <div className="flex flex-col justify-end">
          <span className="text-center text-lg md:text-left">
            {album.artists.map((artist) => artist.name).join(', ')}
          </span>
          <h1 className="text-center md:text-left">{album.name}</h1>
        </div>
      </section>

      <Section title="Album content" description="The tracks on this album">
        <ul className="grid grid-rows-none gap-y-3 md:grid-flow-col md:grid-rows-5">
          {tracks.map((track, i) => (
            <li key={i}>
              <Link href={`/track/${track.id}`} passHref>
                <a className="flex">
                  <span className="px-5">{i + 1}.</span>

                  <div>
                    <h4>{track.name}</h4>
                    <p className="m-0">
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Top listeners"
        description={`People who listen a lot to ${album.name}`}
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

      <Section title="Your streams">
        {streams ? (
          <RecentStreams streams={streams} />
        ) : (
          <div className="grid w-full place-items-center">
            <MdMusicOff />

            <p className="m-0 text-text-grey">
              Looks like you haven&apos;t listened to any track of {album.name}{' '}
              yet
            </p>
          </div>
        )}
      </Section>
    </>
  );
};

export default Album;
