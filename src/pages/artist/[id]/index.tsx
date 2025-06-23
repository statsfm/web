import type * as statsfm from '@/utils/statsfm';
import { useAuth, useApi } from '@/hooks';
import type { GetServerSideProps, NextPage } from 'next';
import type { FC } from 'react';
import { Avatar } from '@/components/Avatar';
import { Chip, ChipGroup } from '@/components/Chip';
import { Section } from '@/components/Section/Section';
import { useEffect, useMemo, useState } from 'react';

import { RecentStreams } from '@/components/RecentStreams';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Title } from '@/components/Title';
import Head from 'next/head';
import { StatsCardContainer } from '@/components/Stats';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser, getApiInstance, getOrigin } from '@/utils/ssrUtils';
import formatter from '@/utils/formatter';
import dayjs from 'dayjs';
import { ArtistTopTracks } from '@/components/Artist/ArtistTopTracks';
import { ArtistTopAlbums } from '@/components/Artist/ArtistTopAlbums';
import { TopListeners } from '@/components/TopListeners';
import { ArtistRelatedArtists } from '@/components/Artist/ArtistRelatedArtists';
import { SpotifyLink, AppleMusicLink } from '@/components/SocialLink';

const Genres: FC<Pick<statsfm.Artist, 'genres'>> = ({ genres }) => (
  <Section title="Genres">
    <ChipGroup>
      {genres.map((genre, i) => (
        <Chip key={`${genre}-${i}`}>
          <Link legacyBehavior href={`/genre/${genre}`}>
            <a>{genre}</a>
          </Link>
        </Chip>
      ))}
    </ChipGroup>
  </Section>
);

type Props = SSRProps & {
  artist: statsfm.Artist;
  origin: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  let artist;
  try {
    artist = await api.artists.get(parseInt(id, 10));
  } catch (e) {
    return { notFound: true };
  }

  const user = await fetchUser(ctx);

  return {
    props: {
      artist,
      user,
      origin: getOrigin(ctx.req),
    },
  };
};

const Artist: NextPage<Props> = ({ artist, origin }) => {
  const api = useApi();
  const { user } = useAuth();

  const [streams, setStreams] = useState<statsfm.Stream[] | null>(null);
  const [stats, setStats] = useState<
    | (statsfm.StreamStats & {
        firstStream?: statsfm.Stream;
        lastStream?: statsfm.Stream;
      })
    | null
  >(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setStreams(await api.users.artistStreams(user.id, artist.id));
      const stats = await api.users.artistStats(user.id, artist.id);
      const firstStreams = await api.users.artistStreams(
        user.customId,
        artist.id,
        {
          limit: 1,
          order: 'asc',
        },
      );

      setStats({
        ...stats,
        firstStream: firstStreams[0],
      });
    })();
  }, [user, artist]);

  const statsResult = useMemo(() => {
    if (!user || !stats) return null;

    const duration = `${formatter.formatMinutes(stats.durationMs)}m`;
    const count = `${formatter.localiseNumber(stats.count)}x`;

    return {
      count,
      duration,
      firstStream: stats.firstStream?.endTime,
      lastStream: streams![0]?.endTime,
    };
  }, [user, stats]);

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
        value: formatter.formatPopularity(artist.spotifyPopularity),
        label: '0-10 popularity',
        loading: false, // assuming this data is always present and doesn't need loading state
      },
      // Add more stats as needed...
    ];
  }, [statsResult, artist]); // Adding artist in the dependencies because of artist.spotifyPopularity

  return (
    <>
      <Title>{`${artist.name} music, stats and more`}</Title>
      <Head>
        <meta
          property="og:image"
          content={`${origin}/api/og/artist/${artist.id}`}
        />
        <meta
          property="og:image:alt"
          content={`${artist.name}'s artist stats`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content={`${artist.name} | stats.fm`} />
        <meta
          property="og:description"
          content={`View ${artist.name} on stats.fm`}
        />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pb-10 pt-24 md:flex-row">
            <Avatar src={artist.image} name={artist.name} size="4xl" />

            <div className="flex flex-col justify-end">
              <h1 className="text-center font-extrabold md:text-left">
                {artist.name}
              </h1>

              <span className="text-center text-lg md:text-left">
                {formatter.localiseNumber(artist.followers)} followers
              </span>

              <div className="mt-2 flex flex-row items-center gap-2">
                {(artist.externalIds.spotify ?? []).length > 0 && (
                  <SpotifyLink
                    path={`/artist/${artist.externalIds.spotify![0]}`}
                  />
                )}
                {(artist.externalIds.appleMusic ?? []).length > 0 && (
                  <AppleMusicLink
                    path={`/${user?.country.toLowerCase() ?? 'us'}/artist/${
                      artist.externalIds.appleMusic![0]
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

        <Genres genres={artist.genres} />

        <ArtistTopTracks artist={artist} />

        <ArtistTopAlbums artist={artist} />

        <TopListeners type="ARTIST" data={artist} />

        <ArtistRelatedArtists artist={artist} />

        {user && (
          <>
            <Section
              title="Your streams"
              description={`Your streams featuring ${artist.name}`}
            >
              {({ headerRef }) => (
                <>
                  <RecentStreams
                    headerRef={headerRef}
                    streams={streams ?? []}
                    loading={streams == null}
                  />
                  {user.hasImported && (
                    <Link legacyBehavior href={`/artist/${artist.id}/streams`}>
                      <a className="my-3 font-bold uppercase text-text-grey transition-colors hover:text-white">
                        show all
                      </a>
                    </Link>
                  )}
                </>
              )}
            </Section>
            <div className="pt-10">
              <div className="bg-foreground shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-base font-semibold leading-6 text-white">
                    Report incorrect metadata
                  </h3>
                  <div className="mt-2 max-w-xl text-sm">
                    <p>Let us know what info you think is incorrect.</p>
                  </div>
                  <div className="mt-3 text-sm leading-6">
                    <Link
                      href={`/reporting/artist/${artist.id}`}
                      className="font-semibold text-primary"
                    >
                      Report{' '}
                      <span className="text-inherit" aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Artist;
