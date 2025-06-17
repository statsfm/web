import React, { Fragment, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import * as statsfm from '@/utils/statsfm';
import Linkify from 'linkify-react';
import { Section } from '@/components/Section/Section';
import { Avatar } from '@/components/Avatar';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks';
import { RecentStreams } from '@/components/RecentStreams';

import { Container } from '@/components/Container';
import Link from 'next/link';
import { Title } from '@/components/Title';
import Head from 'next/head';
import { Button } from '@/components/Button';
import clsx from 'clsx';
import type { SSRProps } from '@/utils/ssrUtils';
import { getApiInstance, fetchUser, getOrigin } from '@/utils/ssrUtils';
import { FriendStatus } from '@/utils/statsfm';
import { sendGAEvent } from '@next/third-parties/google';
import { useScrollPercentage } from '@/hooks/use-scroll-percentage';
import formatter from '@/utils/formatter';
import { SpotifyLink, DiscordLink } from '@/components/SocialLink';
import {
  MdArrowDropDown,
  MdCheck,
  MdVisibilityOff,
  MdWarning,
} from 'react-icons/md';
import Scope from '@/components/PrivacyScope';
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
import {
  getTimeframeOptions,
  getTimeframeText,
  rangeToText,
  BetterRange,
} from '@/components/User/utils';
import { Listbox, Transition } from '@headlessui/react';
import { ImportRequiredScope } from '@/components/User/ImportRequiredScope';
import { UserBanScope } from '@/components/User/UserBanScope';
import { PlusBadge } from '@/components/User/PlusBadge';
import { StatsCardContainer } from '@/components/Stats';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Props = SSRProps & {
  userProfile: statsfm.UserPublic;
  friendStatus: statsfm.FriendStatus;
  friendCount: number;
  scrollIntoView: UserScrollIntoView | null;
  selectedTimeframe: {
    range: BetterRange | null;
    year: number | null;
  };
  origin: string;
};

function activeScrollIntoViewFromDeepLink(
  deeplink: string | string[] | undefined,
): UserScrollIntoView | null {
  if (typeof deeplink !== 'object') return null;
  if (deeplink.length !== 1) return null;

  const id = deeplink[0] as UserScrollIntoView;

  if (
    ![
      'genres',
      'tracks',
      'albums',
      'artists',
      'listening-clocks',
      'recent-streams',
    ].includes(id)
  ) {
    return null;
  }

  return id;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { identityToken } = ctx.req.cookies;
  const { id, deeplink } = ctx.params!;
  const { range, year } = ctx.query as unknown as {
    range: BetterRange | null;
    year: string | null;
  };

  const api = getApiInstance(identityToken);

  if (typeof id !== 'string') {
    throw new Error('no param id recieved');
  }

  const scrollIntoView = activeScrollIntoViewFromDeepLink(deeplink);

  const userProfile = await api.users.get(id).catch(() => {});
  if (!userProfile) {
    return {
      notFound: true,
    };
  }

  const userProfileId = encodeURIComponent(userProfile.id);

  const [friendCount, friendStatus] = await Promise.all([
    api.users.friendCount(userProfileId).catch(() => 0),
    api.friends.status(userProfileId).catch(() => FriendStatus.NONE),
  ]);

  const user = await fetchUser(ctx);

  // TODO: extract this to a util function
  const oembedUrl = encodeURIComponent(`https://stats.fm${ctx.resolvedUrl}`);

  ctx.res.setHeader(
    'Link',
    `<https://api.stats.fm/api/v1/oembed?url=${oembedUrl}&format=json>; rel="alternate"; type="application/json+oembed"; title=""`,
  );

  return {
    props: {
      userProfile,
      user,
      friendStatus,
      friendCount,
      scrollIntoView,
      selectedTimeframe: {
        range: range && range.toUpperCase() in BetterRange ? range : null,
        year: year != null ? parseInt(year, 10) : null,
      },
      origin: getOrigin(ctx.req),
    },
  };
};

const User: NextPage<Props> = ({
  userProfile: user,
  friendStatus,
  friendCount,
  scrollIntoView,
  selectedTimeframe: { range, year },
  origin,
}) => {
  const api = useApi();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [timeframe, setTimeframe] = useState<TimeframeSelection>({
    // setting the year for apple music happens in useEffect
    range: range ?? BetterRange.WEEKS,
    selected: 'RANGE',
    custom: {
      start: new Date(),
      end: new Date(),
    },
  });
  const [availableRanges, setAvailableRanges] = useState<
    BetterRange[] | number[]
  >([]);

  useEffect(() => {
    if (
      user.spotifyAuth &&
      [
        statsfm.OrderBySetting.PLATFORM,
        statsfm.OrderBySetting.SPOTIFY,
      ].includes(user.orderBy)
    ) {
      setAvailableRanges([
        BetterRange.WEEKS,
        BetterRange.MONTHS,
        BetterRange.LIFETIME,
      ]);
    } else if (
      user.appleMusicAuth &&
      user.orderBy === statsfm.OrderBySetting.APPLEMUSIC
    ) {
      const sorted = user.appleMusicAuth.availableYears.sort((a, b) => b - a);
      setAvailableRanges(sorted);
      setTimeframe((prev) => ({
        ...prev,
        year: year != null && sorted.includes(year) ? year : sorted[0],
        selected: 'APPLEMUSIC',
      }));
    } else if (
      user.isPlus &&
      [statsfm.OrderBySetting.COUNT, statsfm.OrderBySetting.TIME].includes(
        user.orderBy,
      )
    ) {
      setAvailableRanges([
        BetterRange.TODAY,
        BetterRange.THIS_WEEK,
        BetterRange.WEEKS,
        BetterRange.MONTHS,
        BetterRange.CURRENT_YEAR,
        BetterRange.LIFETIME,
      ]);
    }
  }, [user]);

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

  const discordConnection = user.socialMediaConnections.find(
    (connection) => connection.platform.name === 'Discord',
  );

  const userId = encodeURIComponent(user.id);

  useEffect(() => {
    setStats([]);

    api.users
      .stats(userId, getTimeframeOptions(timeframe))
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
  }, [timeframe, userId]);

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
      .recentlyStreamed(userId)
      .then(setRecentStreams)
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    api.users
      .dateStats(userId, {
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
  }, [timeframe, userId]);

  const handleSegmentSelectSpotify = (value: BetterRange) => {
    sendGAEvent(`USER_switch_time_${value}`);
    if (timeframe.range === value && timeframe.selected === 'RANGE') return;
    setTimeframe((prev) => ({ ...prev, range: value, selected: 'RANGE' }));
    router.push(`/user/${user.customId || user.id}?range=${value}`, undefined, {
      shallow: true,
    });
  };

  const handleSegmentSelectAppleMusic = (value: number) => {
    sendGAEvent(`USER_switch_time_${value}`);
    if (timeframe.year === value && timeframe.selected === 'APPLEMUSIC') return;
    setTimeframe((prev) => ({ ...prev, year: value, selected: 'APPLEMUSIC' }));
    router.push(`/user/${user.customId || user.id}?year=${value}`, undefined, {
      shallow: true,
    });
  };

  useScrollPercentage(30, () => sendGAEvent('USER_scroll_30'));

  if (user.userBan?.active === true) {
    // eslint-disable-next-line no-param-reassign
    user = {
      ...user,
      displayName: 'Banned User',
      image: undefined,
      isPlus: false,
    };
  }

  const privateProfile =
    !(
      user.privacySettings?.recentlyPlayed ||
      user.privacySettings?.topTracks ||
      user.privacySettings?.topAlbums ||
      user.privacySettings?.topArtists ||
      user.privacySettings?.topGenres ||
      user.privacySettings?.streamStats
    ) && currentUser?.id !== user.id;

  return (
    <>
      <Title>
        {`${formatter.nounify(user.displayName)} stats, streams and more`}
      </Title>
      <Head>
        <meta
          property="og:image"
          content={`${origin}/api/og/user/${user.customId ?? user.id}`}
        />
        <meta
          property="og:image:alt"
          content={`${user.displayName}'s profile stats`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:description"
          content={`View ${user.displayName} on stats.fm to see all of their listening statistics!`}
        />
        <meta property="twitter:card" content="summary_large_image" />
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
            <section className="flex flex-col items-center gap-5 pb-10 pt-24 md:flex-row">
              <div className="relative rounded-full border-2 border-background">
                <Avatar src={user.image} name={user.displayName} size="4xl" />
                <div className="absolute bottom-2 right-0 text-center text-lg font-medium md:text-left">
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
                    <pre className="line-clamp-3 whitespace-pre-wrap text-center font-body text-lg md:text-left [&>a]:font-semibold [&>a]:text-primary">
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
                          'mx-0 w-min !bg-transparent !p-0 transition-opacity hover:opacity-80',
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
                      {user.spotifyAuth && (
                        <SpotifyLink path={`/user/${user.id}`} />
                      )}
                      {discordConnection && (
                        <DiscordLink
                          path={`/users/${discordConnection.platformUserId}`}
                        />
                      )}
                    </div>
                  </Scope>
                )}
              </div>
            </section>
          </Container>
        </div>

        {/* Active user page */}
        <UserBanScope user={user}>
          {privateProfile ? (
            <div className="my-36 grid w-full place-items-center">
              <MdVisibilityOff />
              <p className="m-0 text-text-grey">
                {formatter.nounify(user.displayName)} profile is private
              </p>
            </div>
          ) : (
            <Container className="mt-8">
              {user.quarantined && (
                <section className="pb-10">
                  <div className="flex items-center">
                    <MdWarning className="mr-2 text-white opacity-60" />
                    <p>This account&apos;s streams have been quarantined</p>
                    {/* TODO: Add info button with link to a support article or a popup message */}
                  </div>
                </section>
              )}

              <section className="flex flex-col justify-between gap-5 md:flex-row-reverse">
                {availableRanges.length > 0 &&
                  // if instance of number[] then it's apple music
                  (typeof availableRanges[0] === 'number' ? (
                    <div className="z-50 flex justify-center">
                      <Listbox
                        value={timeframe.year}
                        onChange={handleSegmentSelectAppleMusic}
                      >
                        <div className="relative mt-1 w-72">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-foreground py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
                            <span className="block truncate">
                              {timeframe.year}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <MdArrowDropDown
                                className="size-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-foreground py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                              {(availableRanges as number[]).map((year) => (
                                <Listbox.Option
                                  key={year}
                                  value={year}
                                  className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                      active
                                        ? 'bg-background/50'
                                        : 'text-gray-900'
                                    }`
                                  }
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected && 'text-white'
                                        }`}
                                      >
                                        {year}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                          <MdCheck
                                            className="size-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  ) : (
                    <div className="z-50 flex justify-center">
                      <Listbox
                        value={timeframe.range}
                        onChange={handleSegmentSelectSpotify}
                      >
                        <div className="relative mt-1 w-72">
                          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-foreground py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
                            <span className="block truncate">
                              {rangeToText(timeframe.range)}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <MdArrowDropDown
                                className="size-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>
                          <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-foreground py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                              {(availableRanges as BetterRange[]).map(
                                (range) => (
                                  <Listbox.Option
                                    key={range}
                                    value={range}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? 'bg-background/50'
                                          : 'text-gray-900'
                                      }`
                                    }
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected && 'text-white'
                                          }`}
                                        >
                                          {rangeToText(range)}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                            <MdCheck
                                              className="size-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ),
                              )}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  ))}
                {user.isPlus && (
                  <ImportRequiredScope value="streamStats">
                    <StatsCardContainer stats={stats} />
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
                [
                  statsfm.OrderBySetting.COUNT,
                  statsfm.OrderBySetting.TIME,
                ].includes(user.orderBy) && (
                  <Section
                    title="Listening clocks"
                    className="flex w-full flex-col gap-2 md:flex-row"
                    scope="streamStats"
                    description={`${
                      isCurrentUser ? 'Your' : `${user.displayName}'s`
                    } listening habits throughout the day ${getTimeframeText(
                      timeframe,
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
                      onItemClick={() => sendGAEvent('USER_recent_track_click')}
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
        </UserBanScope>
      </Scope.Context>
    </>
  );
};

export default User;
