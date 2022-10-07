import { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import * as statsfm from '@statsfm/statsfm.js';
import Linkify from 'linkify-react';

// components
import { Section } from '@/components/Section';
import { Segment, SegmentedControls } from '@/components/SegmentedControls';
import { StatsCard, StatsCardSkeleton } from '@/components/StatsCard';
import { TrackCard, TrackCardSkeleton } from '@/components/TrackCard';
import { Carousel } from '@/components/Carousel';
import { Avatar } from '@/components/Avatar';
import { MdVisibilityOff } from 'react-icons/md';
import { useApi } from '@/hooks/use-api';
import { Chip, ChipGroup } from '@/components/Chip';
import { useAuth } from '@/hooks';
import { AlbumCard, AlbumCardSkeleton } from '@/components/AlbumCard';
import { ArtistCard, ArtistCardSkeleton } from '@/components/ArtistCard';
import { RecentStreams } from '@/components/RecentStreams';
import { SectionToolbarCarouselNavigationButton } from '@/components/SectionToolbarCarouselNavigationButton';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Title } from '@/components/Title';
import Head from 'next/head';
import { CrownIcon } from '@/components/Icons';

// const ListeningClockChart = () => {
//   const config = {
//     data: {
//       labels: [
//         'Acoustic',
//         'Danceable',
//         'Energetic',
//         'Instrumental',
//         'Lively',
//         'Speechful',
//         'Valence',
//       ],
//       datasets: [
//         {
//           label: '',
//           data: [
//             11, 16, 7, 3, 14, 20, 12, 6, 9, 10, 5, 8, 21, 5, 4, 2, 13, 18, 16,
//             19, 5, 2, 1, 0,
//           ],
//           fill: true,
//           backgroundColor: 'rgb(30, 215, 96)',
//           borderColor: 'rgb(30, 215, 96)',
//         },
//       ],
//     },
//     options: {
//       angleLines: {
//         display: true,
//       },
//       cutoutPercentage: 20,
//       scales: {
//         r: {
//           grid: {
//             color: 'rgb(23, 26, 32)',
//           },
//           angleLines: {
//             color: 'rgb(23, 26, 32)',
//           },
//           ticks: {
//             display: false,
//           },
//         },
//       },
//     },
//   };

//   ChartJS.register(RadialLinearScale, ArcElement);

//   return <PolarArea {...config} />;
// };

interface Props {
  user: statsfm.UserPublic;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi();
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  const user = await api.users.get(id).catch(() => {});
  if (!user) return { notFound: true };

  // TODO: extract this to a util function
  const oembedUrl = encodeURIComponent(`https://stats.fm${ctx.resolvedUrl}`);
  ctx.res.setHeader(
    'Link',
    `<https://beta-api.stats.fm/api/v1/oembed?url=${oembedUrl}&format=json>; rel="alternate"; type="application/json+oembed"; title=""`
  );

  return {
    props: {
      user,
    },
  };
};

// TODO: Link to /plus
const PlusBadge = () => (
  <span className="mx-auto flex w-fit items-center rounded-md bg-plus/10 px-1.5 py-0.5 text-sm text-plus md:mx-0">
    <CrownIcon className="mr-1 h-4 w-3.5" />
    stats.fm Plus
  </span>
);

const UserContext = createContext<statsfm.UserPublic | null>(null);

const useUserContext = (component: string) => {
  const ctx = useContext(UserContext);

  if (!ctx)
    throw new Error(
      `<${component} /> is missing a parent <UserContext.Provider /> component.`
    );

  return ctx;
};

const PrivacyScope = ({
  scope,
  children,
}: PropsWithChildren<{
  scope: keyof statsfm.UserPrivacySettings;
}>) => {
  const user = useUserContext('PrivacyScope');

  if (user.privacySettings && user.privacySettings[scope]) {
    return <>{children}</>;
  }

  return (
    <div className="grid w-full place-items-center">
      <MdVisibilityOff />

      <p className="m-0 text-text-grey">
        {user.displayName} doesn&apos;t share this
      </p>
    </div>
  );
};

const ImportRequiredScope = ({
  placeholder,
  children,
}: PropsWithChildren<{ placeholder?: JSX.Element }>) => {
  const user = useUserContext('ImportRequiredScope');
  // the currently logged in user
  const { user: currentUser } = useAuth();

  if (user.hasImported) {
    return <>{children}</>;
  }

  // TODO: look for a better way to implement getting the user context
  if (user.id === currentUser?.id || user.id === 'me') {
    return (
      <div className="relative w-full">
        <div className="blur-sm">{placeholder}</div>

        <div className="absolute inset-0 grid place-items-center">
          <p className="m-0">
            This feature requires{' '}
            {/* TODO: replace the link with a router link */}
            <a className="underline" href="https://stats.fm/import">
              import of streams
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="blur-sm">{placeholder}</div>

      <div className="absolute inset-0 grid place-items-center">
        <p className="m-0 text-text-grey">
          Ask {user.displayName} to{' '}
          <a className="underline" href="https://stats.fm/import">
            import their streaming history
          </a>{' '}
          to view this
        </p>
      </div>
    </div>
  );
};

// const NotEnoughData = ({
//   data,
//   children,
// }: PropsWithChildren<{ data: any[] }>) => {
//   if (data && data.length === 0) {
//     return (
//       <div className="grid w-full place-items-center">
//         <MdCloudOff />

//         <p className="m-0 text-text-grey">
//           not enough data to calculate advanced stats
//         </p>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

// TODO: use i18n strings instead
const ranges: Record<statsfm.Range, string> = {
  weeks: '4 weeks',
  months: '6 months',
  lifetime: 'lifetime',
  days: 'days',
  today: 'today',
};

const User: NextPage<Props> = ({ user }) => {
  const api = useApi();
  const { user: currentUser } = useAuth();
  const [range, setRange] = useState<statsfm.Range>(statsfm.Range.WEEKS);

  const [stats, setStats] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [topGenres, setTopGenres] = useState<statsfm.TopGenre[]>([]);
  const [topTracks, setTopTracks] = useState<statsfm.TopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<statsfm.TopArtist[]>([]);
  const [topAlbums, setTopAlbums] = useState<statsfm.TopAlbum[]>([]);
  const [recentStreams, setRecentStreams] = useState<
    statsfm.RecentlyPlayedTrack[]
  >([]);

  const isCurrentUser = currentUser?.id === user.id;

  useEffect(() => {
    setStats([]);
    setTopGenres([]);
    setTopTracks([]);
    setTopArtists([]);
    setTopAlbums([]);

    const load = async () => {
      if (user.privacySettings?.streamStats) {
        const stats = await api.users.stats(user.id, { range });

        // const timeframe: Record<Partial<statsfm.Range>, number> = {
        //   weeks: 4 * (24 * 7),
        //   months: 8766 / 2,
        // };

        const hours = dayjs.duration(stats.durationMs).asHours();

        setStats([
          {
            label: 'streams',
            value: stats.count.toLocaleString(),
          },
          {
            label: 'minutes streamed',
            value: Math.round(
              dayjs.duration(stats.durationMs).asMinutes()
            ).toLocaleString(),
          },
          {
            label: 'hours streamed',
            value: Math.round(hours).toLocaleString(),
          },
          {
            label: 'different tracks',
            value: stats.cardinality.tracks.toLocaleString() ?? 0,
          },
          {
            label: 'different artists',
            value: stats.cardinality.artists.toLocaleString() ?? 0,
          },
          {
            label: 'different albums',
            value: stats.cardinality.albums.toLocaleString() ?? 0,
          },
          // {
          //   label: `You were listening to music {${
          //     Math.round((hours / timeframe[range]) * 100 * 10) / 10
          //   }%} ${ranges[range]}`,
          //   value: `${Math.round((hours / timeframe[range]) * 100 * 10) / 10}%`,
          // },
        ]);
      }

      if (user.privacySettings?.topGenres)
        setTopGenres(await api.users.topGenres(user.id, { range }));
      if (user.privacySettings?.topTracks)
        setTopTracks(await api.users.topTracks(user.id, { range }));
      if (user.privacySettings?.topArtists)
        setTopArtists(await api.users.topArtists(user.id, { range }));
      if (user.privacySettings?.topAlbums)
        setTopAlbums(await api.users.topAlbums(user.id, { range }));
    };

    load();
  }, [range, user]);

  // TODO: improvements
  useEffect(() => {
    const load = async () => {
      if (user.privacySettings?.recentlyPlayed)
        setRecentStreams(await api.users.recentlyStreamed(user.id));
    };

    load();
  }, [user]);

  const handleSegmentSelect = (value: string) => {
    setRange(statsfm.Range[value.toUpperCase() as keyof typeof statsfm.Range]);
  };

  return (
    <>
      <Title>
        {`${user.displayName}'${
          user.displayName.endsWith('s') || 's'
        } stats, streams and more`}
      </Title>
      <Head>
        <meta property="og:image" content={user.image} />
        <meta
          property="og:image:alt"
          content={`${user.displayName}'s profile picture`}
        />
        <meta property="og:image:width" content="240" />
        <meta property="og:image:height" content="240" />
        <meta
          property="og:description"
          content={`View ${user.displayName} on stats.fm to see all of their listening statistics!`}
        />
        <meta property="twitter:card" content="summary" />
      </Head>
      <UserContext.Provider value={user}>
        <div className="bg-foreground pt-20">
          <Container>
            <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
              <Avatar src={user.image} name={user.displayName} size="4xl" />

              <div className="flex flex-col justify-end">
                <span className="text-center text-lg font-medium md:text-left">
                  {user.privacySettings?.profile && user.profile?.pronouns}{' '}
                  {user.isPlus && <PlusBadge />}
                </span>

                <h1 className="text-center font-extrabold md:text-left">
                  {user.displayName}
                </h1>

                {user.privacySettings?.profile && user.profile?.bio && (
                  <pre className="whitespace-pre-wrap  font-body  text-lg md:text-left [&>a]:font-semibold [&>a]:text-primary">
                    <Linkify
                      options={{ target: '_blank', rel: 'noopener noreferrer' }}
                    >
                      {user.profile.bio}
                    </Linkify>
                  </pre>
                )}
              </div>
            </section>
          </Container>
        </div>

        <Container className="mt-8">
          <section className="flex flex-col justify-between gap-5 md:flex-row-reverse">
            <SegmentedControls onChange={handleSegmentSelect}>
              <Segment value={statsfm.Range.WEEKS}>4 weeks</Segment>
              <Segment value={statsfm.Range.MONTHS}>6 months</Segment>
              <Segment value={statsfm.Range.LIFETIME}>lifetime</Segment>
            </SegmentedControls>

            <ImportRequiredScope
              placeholder={
                <ul className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                  {['minutes streamed', 'hours streamed', 'streams'].map(
                    (label, i) => (
                      <li key={i}>
                        <StatsCard
                          // TODO: better way of implementing this
                          label={label}
                          value="?"
                        />
                      </li>
                    )
                  )}
                </ul>
              }
            >
              <PrivacyScope scope="streamStats">
                <ul className="grid w-full grid-cols-2 gap-4 md:w-4/6 md:grid-cols-4">
                  {stats.length > 0
                    ? stats.map((item, i) => (
                        <li key={i}>
                          <StatsCard {...item} />
                        </li>
                      ))
                    : Array(6)
                        .fill(null)
                        .map((_n, i) => (
                          <li key={i}>
                            <StatsCardSkeleton />
                          </li>
                        ))}
                </ul>
              </PrivacyScope>
            </ImportRequiredScope>
          </section>

          {/* <ListeningClockChart /> */}

          <Section
            title="Top genres"
            description={`${
              isCurrentUser ? 'Your' : `${user.displayName}'s`
            } top genres from the past ${ranges[range]}`}
          >
            {/* TODO: add some sort of skeleton */}
            <ChipGroup>
              {topGenres.map((genre, i) => (
                <Chip key={i}>
                  <Link href={`/genre/${genre.genre.tag}`}>
                    {genre.genre.tag}
                  </Link>
                </Chip>
              ))}
            </ChipGroup>
          </Section>

          <Carousel>
            <Section
              title="Top tracks"
              description={`${
                isCurrentUser ? 'Your' : `${user.displayName}'s`
              } top tracks from the past ${ranges[range]}`}
              toolbar={
                <div className="flex gap-1">
                  <SectionToolbarCarouselNavigationButton />
                  <SectionToolbarCarouselNavigationButton next />
                </div>
              }
            >
              <PrivacyScope scope="topTracks">
                {/* <NotEnoughData data={topTracks}> */}

                <Carousel.Items>
                  {topTracks.length > 0
                    ? topTracks.map((item, i) => (
                        <Carousel.Item key={i}>
                          <TrackCard {...item} />
                        </Carousel.Item>
                      ))
                    : Array(10)
                        .fill(null)
                        .map((_n, i) => (
                          <Carousel.Item key={i}>
                            <TrackCardSkeleton />
                          </Carousel.Item>
                        ))}
                </Carousel.Items>
                {/* </NotEnoughData> */}
              </PrivacyScope>
            </Section>
          </Carousel>

          <Carousel>
            <Section
              title="Top artists"
              // TODO: pluralization
              description={`${
                isCurrentUser ? 'Your' : `${user.displayName}'s`
              } top artists from the past ${ranges[range]}`}
              toolbar={
                <div className="flex gap-1">
                  <SectionToolbarCarouselNavigationButton />
                  <SectionToolbarCarouselNavigationButton next />
                </div>
              }
            >
              <PrivacyScope scope="topArtists">
                {/* <NotEnoughData data={topArtists}> */}
                <Carousel.Items>
                  {topArtists.length > 0
                    ? topArtists.map((item, i) => (
                        <Carousel.Item key={i}>
                          <ArtistCard {...item} />
                        </Carousel.Item>
                      ))
                    : Array(10)
                        .fill(null)
                        .map((_n, i) => (
                          <Carousel.Item key={i}>
                            <ArtistCardSkeleton />
                          </Carousel.Item>
                        ))}
                </Carousel.Items>
                {/* </NotEnoughData> */}
              </PrivacyScope>
            </Section>
          </Carousel>

          <Carousel>
            <Section
              title="Top albums"
              description={`${
                isCurrentUser ? 'Your' : `${user.displayName}'s`
              } top albums from the past ${ranges[range]}`}
              toolbar={
                <div className="flex gap-1">
                  <SectionToolbarCarouselNavigationButton />
                  <SectionToolbarCarouselNavigationButton next />
                </div>
              }
            >
              <PrivacyScope scope="topAlbums">
                {/* <NotEnoughData data={topAlbums}> */}
                <Carousel.Items>
                  {topAlbums && topAlbums.length > 0
                    ? topAlbums.map((item, i) => (
                        <Carousel.Item key={i}>
                          <AlbumCard {...item} />
                        </Carousel.Item>
                      ))
                    : Array(10)
                        .fill(null)
                        .map((_n, i) => (
                          <Carousel.Item key={i}>
                            <AlbumCardSkeleton />
                          </Carousel.Item>
                        ))}
                </Carousel.Items>
                {/* </NotEnoughData> */}
              </PrivacyScope>
            </Section>
          </Carousel>

          <Section
            title="Recent streams"
            description={`${
              isCurrentUser ? 'Your' : `${user.displayName}'s`
            } recently played tracks`}
          >
            {({ headerRef }) => (
              <PrivacyScope scope="recentlyPlayed">
                <RecentStreams headerRef={headerRef} streams={recentStreams} />
              </PrivacyScope>
            )}
          </Section>
        </Container>
      </UserContext.Provider>
    </>
  );
};

export default User;
