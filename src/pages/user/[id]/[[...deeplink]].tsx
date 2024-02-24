import React, { useEffect, useRef, useState } from 'react';
import type { FC, PropsWithChildren, RefObject } from 'react';
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
import { clockProps, type UserScrollIntoView } from '@/utils';
import dynamic from 'next/dynamic';
import type { TimeframeSelection } from '@/components/User/utils';
import { getTimeframeOptions, getTimeframeText } from '@/components/User/utils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = SSRProps & {
  userProfile: statsfm.UserPublic;
  friendStatus: statsfm.FriendStatus;
  friendCount: number;
  scrollIntoView: UserScrollIntoView | null;
};

function activeScrollIntoViewFromDeepLink(
  deeplink: string | string[] | undefined
): UserScrollIntoView | null {
  if (typeof deeplink !== 'object') return null;
  if (deeplink.length !== 1) return null;

  const [id] = deeplink;
  if (
    id !== 'genres' &&
    id !== 'tracks' &&
    id !== 'albums' &&
    id !== 'artists' &&
    id !== 'listening-clocks' &&
    id !== 'recent-streams'
  )
    return null;

  return id;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { identityToken } = ctx.req.cookies;
  const { id, deeplink } = ctx.params!;

  const api = getApiInstance(identityToken);

  if (typeof id !== 'string') {
    throw new Error('no param id recieved');
  }

  const scrollIntoView = activeScrollIntoViewFromDeepLink(deeplink);

  const userProfile = await api.users.get(id).catch(() => {});
  if (!userProfile)
    return {
      notFound: true,
    };

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
    `<https://api.stats.fm/api/v1/oembed?url=${oembedUrl}&format=json>; rel="alternate"; type="application/json+oembed"; title=""`
  );

  return {
    props: {
      userProfile,
      user,
      friendStatus,
      friendCount,
      scrollIntoView,
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
      <Link className="underline" href="/settings/imports">
        import their streaming history
      </Link>{' '}
      to view this
    </>
  );

  if (viewer !== null && target.id === viewer.id)
    Content = (
      <>
        This feature requires{' '}
        <Link className="underline" href="/settings/imports">
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

const UserBanScope: FC<PropsWithChildren<{ user: statsfm.UserPublic }>> = ({
  children,
  user,
}) => {
  if (user.userBan?.active === true) {
    return (
      <Container className="mt-8">
        <h3>Account banned</h3>
        <p className="[&>a]:text-primary">
          The account you are viewing has been banned from the platform.
        </p>
        <p className="[&>a]:text-primary">
          You can view more info about banned accounts here{' '}
          <Linkify options={{ target: '_blank', rel: 'noopener noreferrer' }}>
            https://support.stats.fm/docs/banned
          </Linkify>
          .
        </p>
      </Container>
    );
  }

  return <>{children}</>;
};

const User: NextPage<Props> = ({
  userProfile: user,
  friendStatus,
  friendCount,
  scrollIntoView,
}) => {
  const api = useApi();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState<TimeframeSelection>({
    range: statsfm.Range.WEEKS,
  });

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
  const topGenresRef = useRef<HTMLElement>(null);
  const listeningClocksRef = useRef<HTMLElement>(null);
  const recentStreamsRef = useRef<HTMLElement>(null);

  const isCurrentUser = currentUser?.id === user.id;

  useEffect(() => {
    setStats([]);
    api.users
      .stats(user.id, getTimeframeOptions(timeframe))
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
  }, [timeframe, user]);

  useEffect(() => {
    const refs: Record<UserScrollIntoView, RefObject<HTMLElement>> = {
      tracks: topTracksRef,
      albums: topAlbumsRef,
      artists: topArtistsRef,
      genres: topGenresRef,
      'listening-clocks': listeningClocksRef,
      'recent-streams': recentStreamsRef,
    };

    if (scrollIntoView) refs[scrollIntoView].current?.scrollIntoView();
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
        ...getTimeframeOptions(timeframe),
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
  }, [timeframe]);

  const handleSegmentSelect = (value: statsfm.Range) => {
    event(`USER_switch_time_${value}`);
    if (value === statsfm.Range.TODAY) {
      setTimeframe({
        range: value,
        custom: {
          start: dayjs().startOf('day').toDate(),
          end: dayjs().add(1, 'day').startOf('day').toDate(),
        },
        selected: 'CUSTOM',
      });
    } else setTimeframe({ range: value as statsfm.Range, selected: 'RANGE' });
  };

  useScrollPercentage(30, () => event('USER_scroll_30'));

  if (user.userBan?.active === true) {
    // eslint-disable-next-line no-param-reassign
    user = {
      ...user,
      displayName: 'Banned User',
      image: undefined,
      isPlus: false,
    };
  }

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
                <Avatar src={user.image} name={user.displayName} size="4xl" />
                <div className="absolute right-0 bottom-2 text-center text-lg font-medium md:text-left">
                  {user.isPlus && <PlusBadge />}
                </div>
              </div>

              <div className="flex flex-col items-center justify-end md:items-start">
                <span className="flex">
                  <h1 className="text-center font-extrabold md:text-left">
                    {user.displayName}
                  </h1>
                  <span className="ml-2 mt-2 self-center text-center text-lg font-medium md:text-left">
                    {user.privacySettings?.profile &&
                      user.userBan?.active !== true &&
                      user.profile?.pronouns}
                  </span>
                </span>
                {user.privacySettings?.profile &&
                  user.profile?.bio &&
                  user.userBan?.active !== true && (
                    <pre className="whitespace-pre-wrap text-center font-body text-lg line-clamp-3 md:text-left [&>a]:font-semibold [&>a]:text-primary">
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
        <UserBanScope user={user}>
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
                onChange={handleSegmentSelect as (value: string) => void}
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
              {user.isPlus && (
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
              )}
            </section>

            <TopGenres
              timeframe={timeframe}
              userProfile={user}
              topGenresRef={topGenresRef}
            />

            <TopTracks
              timeframe={timeframe}
              userProfile={user}
              trackRef={topTracksRef}
              activeCarousel={scrollIntoView === 'tracks'}
            />

            <TopArtists
              timeframe={timeframe}
              userProfile={user}
              artistRef={topArtistsRef}
              activeCarousel={scrollIntoView === 'artists'}
            />

            {user.isPlus && (
              <TopAlbums
                timeframe={timeframe}
                userProfile={user}
                albumRef={topAlbumsRef}
                activeCarousel={scrollIntoView === 'albums'}
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
                  } listening habits throughout the day ${getTimeframeText(
                    timeframe
                  )} `}
                  ref={listeningClocksRef}
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
              ref={recentStreamsRef}
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
        </UserBanScope>
      </Scope.Context>
    </>
  );
};

export default User;
