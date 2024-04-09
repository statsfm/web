import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import type * as statsfm from '@/utils/statsfm';

import Link from 'next/link';
import { Image } from '@/components/Image';
import { Section } from '@/components/Section/Section';
import { RecentStreams } from '@/components/RecentStreams';

import { useApi, useAuth } from '@/hooks';
import { Container } from '@/components/Container';
import { ArtistList } from '@/components/Artist/ArtistList';
import { Title } from '@/components/Title';
import Head from 'next/head';
import { StatsCardContainer } from '@/components/Stats';

import { useScrollPercentage } from '@/hooks/use-scroll-percentage';
import { event } from 'nextjs-google-analytics';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser, getApiInstance } from '@/utils/ssrUtils';
import formatter from '@/utils/formatter';

import { AppleMusicLink, SpotifyLink } from '@/components/SocialLink';
import dayjs from 'dayjs';
import { TopListeners } from '@/components/TopListeners';

type Props = SSRProps & {
  album: statsfm.Album;
  tracks: statsfm.Track[];
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  let album;
  let tracks;

  try {
    album = await api.albums.get(parseInt(id, 10));
    tracks = await api.albums.tracks(parseInt(id, 10));
  } catch (e) {
    return { notFound: true };
  }

  const user = await fetchUser(ctx);

  return {
    props: {
      album,
      tracks,
      user,
    },
  };
};

const Album: NextPage<Props> = ({ album, tracks }) => {
  const api = useApi();
  const [streams, setStreams] = useState<statsfm.Stream[] | null>(null);
  const [stats, setStats] = useState<statsfm.StreamStats | null>(null);
  const [firstStream, setFirstStream] = useState<statsfm.Stream | null>(null);
  const { user } = useAuth();

  useScrollPercentage(30, () => event('ALBUM_scroll_30'));

  useEffect(() => {
    if (user) {
      api.users
        .albumStreams(user.customId, album.id)
        .then((res) => setStreams(res))
        .catch(() => setStreams([]));

      api.users
        .albumStats(user.customId, album.id)
        .then((res) => setStats(res))
        .catch(() => setStats(null));

      api.users
        .albumStreams(user.customId, album.id, {
          limit: 1,
          order: 'asc',
        })
        .then((res) => setFirstStream(res[0] ?? null))
        .catch(() => setFirstStream(null));
    }
  }, [album, user]);

  const statsResult = useMemo(() => {
    if (!user || !stats || !streams) return null;

    const duration = `${formatter.formatMinutes(stats.durationMs)}m`;
    const count = `${formatter.localiseNumber(stats.count)}x`;

    const lastStream = streams[0]?.endTime;

    return { count, duration, firstStream: firstStream?.endTime, lastStream };
  }, [user, stats, streams]);

  const statsCards = useMemo(() => {
    return [
      {
        value: statsResult?.count ?? '-',
        label: 'total times streamed',
        loading: !statsResult,
        loginRequired: true,
      },
      {
        value: statsResult?.duration ?? '-',
        label: 'total minutes streamed',
        loading: !statsResult,
        loginRequired: true,
      },
      {
        value: statsResult?.firstStream
          ? dayjs(statsResult?.firstStream).format('LL')
          : '-',
        label: `first streamed ${
          statsResult?.firstStream
            ? `at ${dayjs(statsResult.firstStream).format('LT')}`
            : ''
        }`,
        loading: !statsResult,
        loginRequired: true,
      },
      {
        value: statsResult?.lastStream
          ? dayjs(statsResult?.lastStream).format('LL')
          : '-',
        label: `last streamed ${
          statsResult?.lastStream
            ? `at ${dayjs(statsResult.lastStream).format('LT')}`
            : ''
        }`,
        loading: !statsResult,
        loginRequired: true,
      },
      {
        value: formatter.localiseNumber(album.totalTracks),
        label: 'tracks',
      },
      {
        value: formatter.formatPopularity(album.spotifyPopularity),
        label: '0-10 popularity',
      },
      {
        value: album.type,
        label: 'type of album',
      },
      {
        value: dayjs(album.releaseDate).format('L'),
        label: 'release date',
      },
    ];
  }, [statsResult, album]); // Note: I changed the dependency from artist to album because the original array you gave used album data

  return (
    <>
      <Title>{`${album.name}, tracks, stats and more`}</Title>
      <Head>
        <meta property="og:image" content={album.image} />
        <meta property="og:image:alt" content={`${album.name}'s cover`} />
        <meta property="og:image:width" content="240" />
        <meta property="og:image:height" content="240" />
        <meta property="og:title" content={`${album.name} | stats.fm`} />
        <meta
          property="og:description"
          content={`View ${album.name} on stats.fm`}
        />
        <meta property="twitter:card" content="summary" />
      </Head>

      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
            {album.image && (
              <Image
                src={album.image}
                alt={album.name}
                width={192}
                height={192}
              />
            )}

            <div className="flex flex-col justify-end">
              <span className="text-center text-lg md:text-left">
                <ArtistList artists={album.artists} />
              </span>
              <h1 className="text-center font-extrabold md:text-left">
                {album.name}
              </h1>
              <div className="mt-2 flex flex-row items-center gap-2">
                {(album.externalIds.spotify ?? []).length > 0 && (
                  <SpotifyLink
                    path={`/album/${album.externalIds.spotify![0]}`}
                  />
                )}
                {(album.externalIds.appleMusic ?? []).length > 0 && (
                  <AppleMusicLink
                    path={`/${user?.country.toLowerCase() ?? 'us'}/album/${
                      album.externalIds.appleMusic![0]
                    }`}
                  />
                )}
              </div>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-8">
        <StatsCardContainer stats={statsCards} />
        <Section title="Album content" description="The tracks on this album">
          <ul className="grid grid-cols-1 gap-y-3 md:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, i) => (
              <li key={i}>
                <Link legacyBehavior href={`/track/${track.id}`} passHref>
                  <a
                    className="flex max-w-fit overflow-hidden text-ellipsis"
                    onClick={() => event('ALBUM_content_track_click')}
                  >
                    <span className="px-5">{i + 1}.</span>

                    <div className="overflow-hidden">
                      <h4 className="!block overflow-hidden text-ellipsis line-clamp-2">
                        {track.name}
                      </h4>
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

        <TopListeners type="ALBUM" data={album} />

        {user && (
          <Section title="Your streams">
            {({ headerRef }) => (
              <RecentStreams
                headerRef={headerRef}
                streams={streams ?? []}
                loading={streams === null}
                onItemClick={() => event('ALBUM_stream_track_click')}
              />
            )}
          </Section>
        )}
      </Container>
    </>
  );
};

export default Album;
