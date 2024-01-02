import React, { useEffect, useRef, useState } from 'react';
import type { FC, RefObject } from 'react';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import * as statsfm from '@statsfm/statsfm.js';
import Linkify from 'linkify-react';

// components
import { Section } from '@/components/Section/Section';
import { Segment, SegmentedControls } from '@/components/SegmentedControls';
import { Avatar } from '@/components/Avatar';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks';
import { RecentStreams } from '@/components/RecentStreams';

import { Container } from '@/components/Container';
import Link from 'next/link';
import { Title } from '@/components/Title';
import Head from 'next/head';
import { CrownIcon } from '@/components/Icons';
import { Button } from '@/components/Button';
import clsx from 'clsx';
import type { SSRProps } from '@/utils/ssrUtils';
import { getApiInstance, fetchUser } from '@/utils/ssrUtils';
import { FriendStatus } from '@statsfm/statsfm.js';
import { event } from 'nextjs-google-analytics';
import { useScrollPercentage } from '@/hooks/use-scroll-percentage';
import formatter from '@/utils/formatter';
import { SpotifyLink } from '@/components/SocialLink';
import { StatsCard, StatsCardSkeleton } from '@/components/StatsCard';
import { MdVisibilityOff, MdWarning } from 'react-icons/md';
import type { ScopeProps } from '@/components/PrivacyScope';
import Scope, { useScopeContext } from '@/components/PrivacyScope';
import { useRouter } from 'next/router';
import { Square } from '@/components/Square';
import {
  FriendsButton,
  TopAlbums,
  TopArtists,
  TopGenres,
  TopTracks,
} from '@/components/User';
import { clockProps, type UserPageCarouselsWithGrid } from '@/utils';
import dynamic from 'next/dynamic';
import { ranges } from '@/components/User/utils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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

type Props = SSRProps & {
  userProfile: statsfm.UserPublic;
  friendStatus: statsfm.FriendStatus;
  friendCount: number;
  activeCarousel: UserPageCarouselsWithGrid | null;
};

function activeGridModeFromDeepLink(
  deeplink: string | string[] | undefined
): UserPageCarouselsWithGrid | null {
  if (typeof deeplink !== 'object') return null;
  if (deeplink.length !== 1) return null;

  const [id] = deeplink;
  // TODO: this should rewrite or redirect
  if (id !== 'tracks' && id !== 'albums' && id !== 'artists') return null;

  return id;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { identityToken } = ctx.req.cookies;
  const { id, deeplink } = ctx.params!;

  const api = getApiInstance(identityToken);

  if (typeof id !== 'string') {
    throw new Error('no param id recieved');
  }

  const activeCarousel = activeGridModeFromDeepLink(deeplink);

  const userProfile = await api.users.get(id).catch(() => {});
  if (!userProfile) return { notFound: true };

  const user = await fetchUser(ctx);

  let friendStatus = FriendStatus.NONE;
  const friendCount = userProfile.privacySettings?.friends
    ? await api.users.friendCount(userProfile.id).catch(() => 0)
    : 0;

  if (user)
    try {
      friendStatus = await api.friends.status(userProfile.id);
    } catch (e) {
      friendStatus = FriendStatus.NONE;
    }

  // TODO: extract this to a util function
  const oembedUrl = encodeURIComponent(`https://stats.fm${ctx.resolvedUrl}`);
  ctx.res.setHeader(
    'Link',
    `<https://beta-api.stats.fm/api/v1/oembed?url=${oembedUrl}&format=json>; rel="alternate"; type="application/json+oembed"; title=""`
  );

  return {
    props: {
      activeCarousel,
      userProfile,
      user,
      friendStatus,
      friendCount,
    },
  };
};

const PlusBadge = () => (
  <Link href="/plus">
    <span className="mx-auto flex w-fit items-center rounded-md bg-background px-1.5 py-0.5 text-base text-plus md:mx-0">
      <CrownIcon className="mr-1 w-4" />
      Plus
    </span>
  </Link>
);

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

const ImportRequiredScope: FC<ScopeProps> = ({ children, value }) => {
  const scopeContext = useScopeContext();

  if (!scopeContext) throw new Error('ScopeContext not found');
  const { target, as: viewer } = scopeContext;

  if (target.hasImported) {
    return <Scope value={value}>{children}</Scope>;
  }

  let Content = (
    <>
      Ask {target.displayName} to{' '}
      <a className="underline" href="https://stats.fm/import">
        import their streaming history
      </a>{' '}
      to view this
    </>
  );

  if (viewer !== null && target.id === viewer.id)
    Content = (
      <>
        This feature requires{' '}
        <Link className="underline" href="/import">
          import of streams
        </Link>
      </>
    );

  return (
    <div className="relative w-full">
      <div className="blur-sm">
        <ul className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {['minutes streamed', 'hours streamed', 'streams'].map((label, i) => (
            <StatsCard key={i} label={label} value="?" />
          ))}
        </ul>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <p className="m-0 text-text-grey">{Content}</p>
      </div>
    </div>
  );
};

const User: NextPage<Props> = ({
  userProfile: user,
  friendStatus,
  friendCount,
  activeCarousel,
}) => {
  const api = useApi();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [range, setRange] = useState<statsfm.Range>(statsfm.Range.WEEKS);

  const [stats, setStats] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [recentStreams, setRecentStreams] = useState<
    statsfm.RecentlyPlayedTrack[]
  >([]);
  const [dateStats, setDateStats] = useState<
    Record<number, statsfm.StreamStats>
  >({});

  const topTracksRef = useRef<HTMLElement>(null);
  const topAlbumsRef = useRef<HTMLElement>(null);
  const topArtistsRef = useRef<HTMLElement>(null);

  const isCurrentUser = currentUser?.id === user.id;

  useEffect(() => {
    setStats([]);
    api.users
      .stats(user.id, { range })
      .then((stats) => {
        const hours = dayjs.duration(stats.durationMs).asHours();

        setStats([
          {
            label: 'streams',
            value: formatter.localiseNumber(stats.count),
          },
          {
            label: 'minutes streamed',
            value: formatter.formatMinutes(stats.durationMs),
          },
          {
            label: 'hours streamed',
            value: formatter.localiseNumber(Math.round(hours)),
          },
          {
            label: 'different tracks',
            value: formatter.localiseNumber(stats.cardinality.tracks) ?? 0,
          },
          {
            label: 'different artists',
            value: formatter.localiseNumber(stats.cardinality.artists) ?? 0,
          },
          {
            label: 'different albums',
            value: formatter.localiseNumber(stats.cardinality.albums) ?? 0,
          },
          // {
          //   label: `You were listening to music {${
          //     Math.round((hours / timeframe[range]) * 100 * 10) / 10
          //   }%} ${ranges[range]}`,
          //   value: `${Math.round((hours / timeframe[range]) * 100 * 10) / 10}%`,
          // },
        ]);
      })
      .catch(() => {});
  }, [range, user]);

  useEffect(() => {
    const refs: Record<UserPageCarouselsWithGrid, RefObject<HTMLElement>> = {
      tracks: topTracksRef,
      albums: topAlbumsRef,
      artists: topArtistsRef,
    };

    if (activeCarousel) refs[activeCarousel].current?.scrollIntoView();
  }, []);

  // TODO: improvements
  useEffect(() => {
    api.users
      .recentlyStreamed(user.id)
      .then(setRecentStreams)
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    api.users
      .dateStats(user.id, {
        range,
        timeZone:
          user.timezone ??
          currentUser?.timezone ??
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      .then((dateStats) => {
        const tempStats: Record<number, statsfm.StreamStats> = {};
        for (let i = 0; i < 24; i += 1) {
          tempStats[i] = dateStats.hours[i] ?? { count: 0, durationMs: 0 };
        }
        setDateStats(tempStats);
      })
      .catch(() => {});
  }, [range]);

  const handleSegmentSelect = (value: string) => {
    event(`USER_switch_time_${value}`);
    setRange(statsfm.Range[value.toUpperCase() as keyof typeof statsfm.Range]);
  };

  useScrollPercentage(30, () => event('USER_scroll_30'));

  return (
    <>
      <Title>
        {`${formatter.nounify(user.displayName)} stats, streams and more`}
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
      <Scope.Context
        as={currentUser}
        target={user}
        fallback={
          <div className="grid w-full place-items-center">
            <MdVisibilityOff />
            <p className="m-0 text-text-grey">
              {user.displayName} doesn&apos;t share this
            </p>
          </div>
        }
      >
        <div className="bg-foreground pt-20">
          <Container>
            <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
              <div className="relative rounded-full border-2 border-background">
                <Avatar
                  src={user.userBan?.active !== true ? user.image : undefined}
                  name={user.userBan?.active ? 'Banned User' : user.displayName}
                  size="4xl"
                />
                <div className="absolute right-0 bottom-2 text-center text-lg font-medium md:text-left">
                  {user.isPlus && <PlusBadge />}
                </div>
              </div>

              <div className="flex flex-col items-center justify-end md:items-start">
                <span className="flex">
                  <h1 className="text-center font-extrabold md:text-left">
                    {user.userBan?.active !== true
                      ? user.displayName
                      : 'Banned User'}
                  </h1>
                  <span className="ml-2 mt-2 self-center text-center text-lg font-medium md:text-left">
                    {user.privacySettings?.profile && user.profile?.pronouns}
                  </span>
                </span>
                {user.privacySettings?.profile &&
                  user.profile?.bio &&
                  user.userBan?.active !== true && (
                    <pre className="whitespace-pre-wrap  font-body  text-lg line-clamp-3 md:text-left [&>a]:font-semibold [&>a]:text-primary">
                      <Linkify
                        options={{
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        }}
                      >
                        {user.profile.bio.replaceAll('\n', ' ')}
                      </Linkify>
                    </pre>
                  )}
                <div className="mt-2 flex items-center">
                  {currentUser && currentUser.id !== user.id && (
                    <>
                      <FriendsButton
                        friendUser={user}
                        initialFriendStatus={friendStatus}
                      />
                      {user.userBan?.active !== true &&
                        user.privacySettings?.friends === true && (
                          <span className="mx-2">
                            <Square />
                          </span>
                        )}
                    </>
                  )}

                  <Scope value="friends" fallback={<></>}>
                    {user.userBan?.active !== true && (
                      <Link
                        legacyBehavior
                        href={`/${user.customId || user.id}/friends`}
                      >
                        <a className="font-medium text-neutral-400">
                          {friendCount}{' '}
                          {formatter.pluralise('Friend', friendCount)}
                        </a>
                      </Link>
                    )}
                  </Scope>

                  {currentUser && currentUser.id === user.id && (
                    <>
                      <span className="mx-2">
                        <Square />
                      </span>
                      <Button
                        className={clsx(
                          'mx-0 w-min !bg-transparent !p-0 transition-opacity hover:opacity-80'
                        )}
                        onClick={() => router.push('/settings/profile')}
                      >
                        Edit profile
                      </Button>
                    </>
                  )}
                </div>

                {user.userBan?.active !== true && (
                  <Scope value="connections" fallback={<></>}>
                    <div className="mt-2 flex flex-row items-center gap-2">
                      <SpotifyLink path={`/user/${user.id}`} />
                    </div>
                  </Scope>
                )}
              </div>
            </section>
          </Container>
        </div>

        {/* Active user page */}
        {user.userBan?.active !== true && (
          <Container className="mt-8">
            {user.quarantined && (
              <section className="pb-10">
                <div className="flex">
                  <MdWarning className="mr-2 mt-1.5 text-white opacity-60" />
                  <p>This account&apos;s streams have been quarantined</p>
                  {/* TODO: Add info button with link to a support article or a popup message */}
                </div>
              </section>
            )}

            <section className="flex flex-col justify-between gap-5 md:flex-row-reverse">
              <SegmentedControls
                onChange={handleSegmentSelect}
                defaultIndex={user.isPlus && user.hasImported ? 1 : 0}
              >
                {user.isPlus && user.hasImported && (
                  <Segment value={statsfm.Range.TODAY}>today</Segment>
                )}
                <Segment selected value={statsfm.Range.WEEKS}>
                  4 weeks
                </Segment>
                <Segment value={statsfm.Range.MONTHS}>6 months</Segment>
                <Segment value={statsfm.Range.LIFETIME}>lifetime</Segment>
              </SegmentedControls>
              <ImportRequiredScope value="streamStats">
                <ul className="grid w-full grid-cols-2 gap-4 md:w-7/12 md:grid-cols-4">
                  {stats.length > 0
                    ? stats.map((item, i) => <StatsCard {...item} key={i} />)
                    : Array(6)
                        .fill(null)
                        .map((_n, i) => (
                          <li key={i}>
                            <StatsCardSkeleton />
                          </li>
                        ))}
                </ul>
              </ImportRequiredScope>
            </section>

            {/* <ListeningClockChart /> */}

            <TopGenres range={range} userProfile={user} />

            <TopTracks
              range={range}
              userProfile={user}
              trackRef={topTracksRef}
              activeCarousel={activeCarousel}
            />

            <TopArtists
              range={range}
              userProfile={user}
              artistRef={topArtistsRef}
              activeCarousel={activeCarousel}
            />

            {user.isPlus && (
              <TopAlbums
                range={range}
                userProfile={user}
                albumRef={topAlbumsRef}
                activeCarousel={activeCarousel}
              />
            )}

            {user.isPlus &&
              user.orderBy !== statsfm.OrderBySetting.PLATFORM && (
                <Section
                  title="Listening clocks"
                  className="flex w-full flex-col gap-2 md:flex-row"
                  scope="streamStats"
                  description={`${
                    isCurrentUser ? 'Your' : `${user.displayName}'s`
                  } listening habits throughout the day ${ranges[range]} `}
                >
                  <Scope value="streamStats">
                    <div className="flex-1 content-center text-center">
                      <Chart {...clockProps(dateStats, 'streams')} />
                      <p>streams</p>
                    </div>
                    <div className="flex-1 content-center text-center">
                      <Chart {...clockProps(dateStats, 'minutes')} />
                      <p>minutes streamed</p>
                    </div>
                  </Scope>
                </Section>
              )}

            <Section
              title="Recent streams"
              description={`${
                isCurrentUser ? 'Your' : `${user.displayName}'s`
              } recently played tracks`}
              scope="recentlyPlayed"
            >
              {({ headerRef }) => (
                <Scope value="recentlyPlayed">
                  <RecentStreams
                    headerRef={headerRef}
                    streams={recentStreams}
                    onItemClick={() => event('USER_recent_track_click')}
                  />
                  {user.hasImported && (
                    <Link
                      legacyBehavior
                      href={`/${user.customId ?? user.id}/streams`}
                    >
                      <a className="my-3 font-bold uppercase text-text-grey transition-colors hover:text-white">
                        show all
                      </a>
                    </Link>
                  )}
                </Scope>
              )}
            </Section>
          </Container>
        )}

        {/* User banned page */}
        {user.userBan?.active === true && (
          <Container className="mt-8">
            <h3>Account banned</h3>
            <p className="[&>a]:text-primary">
              The account you are viewing has been banned from the platform.
            </p>
            <p className="[&>a]:text-primary">
              You can view more info about banned accounts here{' '}
              <Linkify
                options={{ target: '_blank', rel: 'noopener noreferrer' }}
              >
                https://support.stats.fm/docs/banned
              </Linkify>
              .
            </p>
          </Container>
        )}
      </Scope.Context>
    </>
  );
};

export default User;
