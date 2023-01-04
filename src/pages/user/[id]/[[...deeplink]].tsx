import React, { useEffect, useRef, useState } from 'react';
import type { FC, RefObject, PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import * as statsfm from '@statsfm/statsfm.js';
import Linkify from 'linkify-react';

// components
import { Section } from '@/components/Section/Section';
import { Segment, SegmentedControls } from '@/components/SegmentedControls';
import { TrackCard, TrackCardSkeleton } from '@/components/TrackCard';
import { Carousel } from '@/components/Carousel';
import { Avatar } from '@/components/Avatar';
import { useApi } from '@/hooks/use-api';
import { Chip, ChipGroup } from '@/components/Chip';
import { useAuth } from '@/hooks';
import { AlbumCard, AlbumCardSkeleton } from '@/components/AlbumCard';
import { ArtistCard, ArtistCardSkeleton } from '@/components/ArtistCard';
import { RecentStreams } from '@/components/RecentStreams';
import {
  SectionToolbarCarouselNavigationButton,
  SectionToolbarGridmode,
  SectionToolbarInfoMenu,
} from '@/components/Section';
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
import { AppleMusicLink, SpotifyLink } from '@/components/SocialLink';
import { ShareMenuItem } from '@/components/ShareMenuItem';
import { StatsCard, StatsCardSkeleton } from '@/components/StatsCard';
import { MdVisibilityOff } from 'react-icons/md';
import type { ScopeProps } from '@/components/PrivacyScope';
import Scope, { useScopeContext } from '@/components/PrivacyScope';
import { useRouter } from 'next/router';

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

type CarouselsWithGrid = 'tracks' | 'albums' | 'artists';

type Props = SSRProps & {
  userProfile: statsfm.UserPublic;
  friendStatus: statsfm.FriendStatus;
  friendCount: number;
  activeCarousel: CarouselsWithGrid | null;
};

function activeGridModeFromDeepLink(
  deeplink: string | string[] | undefined
): CarouselsWithGrid | null {
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
  let friendCount = 0;
  try {
    friendCount = await api.users.friendCount(userProfile.id);
    friendStatus = await api.me.friendStatus(userProfile.id);
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

const Square = () => <div className="block h-1 w-1 bg-neutral-400" />;

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

const FriendsButtonFrame: FC<
  PropsWithChildren<{ red?: boolean; handler: () => void }>
> = ({ red, children, handler }) => (
  <Button
    className={clsx(
      red ? 'text-red-500' : '',
      'mx-0 w-min !bg-transparent !p-0 transition-opacity hover:opacity-80'
    )}
    onClick={handler}
  >
    {children}
  </Button>
);

const FriendsButton: FC<{
  friendUser: statsfm.UserPublic;
  initialFriendStatus: statsfm.FriendStatus;
}> = ({ friendUser, initialFriendStatus }) => {
  const api = useApi();
  const [friendStatus, setFriendStatus] =
    useState<statsfm.FriendStatus>(initialFriendStatus);

  const handleAccept = () => {
    api.me.acceptFriendRequest(friendUser.id);
    setFriendStatus(FriendStatus.FRIENDS);
  };

  const handleRemove = () => {
    api.me.removeFriend(friendUser.id);
    setFriendStatus(FriendStatus.NONE);
  };

  const handleCancel = () => {
    api.me.cancelFriendRequest(friendUser.id);
    setFriendStatus(FriendStatus.NONE);
  };

  const handleSend = () => {
    api.me.sendFriendRequest(friendUser.id);
    setFriendStatus(FriendStatus.REQUEST_OUTGOING);
  };

  switch (friendStatus) {
    case FriendStatus.FRIENDS:
      return (
        <FriendsButtonFrame red handler={handleRemove}>
          Remove friend
        </FriendsButtonFrame>
      );
    case FriendStatus.REQUEST_INCOMING:
      return (
        <FriendsButtonFrame handler={handleAccept}>
          Accept friend request
        </FriendsButtonFrame>
      );
    case FriendStatus.REQUEST_OUTGOING:
      return (
        <FriendsButtonFrame red handler={handleCancel}>
          Cancel friend request
        </FriendsButtonFrame>
      );
    default:
      return (
        <FriendsButtonFrame handler={handleSend}>
          Send friend request
        </FriendsButtonFrame>
      );
  }
};

// TODO: use i18n strings instead
const ranges: Record<statsfm.Range, string | null> = {
  weeks: 'from the past 4 weeks',
  months: 'from the past 6 months',
  lifetime: '',
  days: null,
  today: null,
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
  const [topGenres, setTopGenres] = useState<statsfm.TopGenre[]>([]);
  const [topTracks, setTopTracks] = useState<statsfm.TopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<statsfm.TopArtist[]>([]);
  const [topAlbums, setTopAlbums] = useState<statsfm.TopAlbum[]>([]);
  const [recentStreams, setRecentStreams] = useState<
    statsfm.RecentlyPlayedTrack[]
  >([]);

  const topTracksRef = useRef<HTMLElement>(null);
  const topAlbumsRef = useRef<HTMLElement>(null);
  const topArtistsRef = useRef<HTMLElement>(null);

  const isCurrentUser = currentUser?.id === user.id;

  useEffect(() => {
    setStats([]);
    setTopGenres([]);
    setTopTracks([]);
    setTopArtists([]);
    setTopAlbums([]);

    const load = async () => {
      api.users.stats(user.id, { range }).then((stats) => {
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
      });

      api.users.topGenres(user.id, { range }).then(setTopGenres);
      api.users.topTracks(user.id, { range }).then(setTopTracks);
      api.users.topArtists(user.id, { range }).then(setTopArtists);
      api.users.topAlbums(user.id, { range }).then(setTopAlbums);
    };

    load();
  }, [range, user]);

  // TODO: improvements
  useEffect(() => {
    api.users.recentlyStreamed(user.id).then(setRecentStreams);
  }, [user]);

  useEffect(() => {
    const refs: Record<CarouselsWithGrid, RefObject<HTMLElement>> = {
      tracks: topTracksRef,
      albums: topAlbumsRef,
      artists: topArtistsRef,
    };

    if (activeCarousel) refs[activeCarousel].current?.scrollIntoView();
  }, []);

  const handleGridModeCallback = (
    gridMode: boolean,
    url: CarouselsWithGrid
  ) => {
    let newUrl = `/${user.customId ?? user.id}`;
    if (!gridMode) newUrl += `/${url}`;

    // this is some next router weirdness
    // https://github.com/vercel/next.js/discussions/18072#discussioncomment-109059
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl
    );

    return !gridMode;
  };

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
                    {user.privacySettings?.profile && user.profile?.pronouns}
                  </span>
                </span>
                {user.privacySettings?.profile && user.profile?.bio && (
                  <pre className="whitespace-pre-wrap  font-body  text-lg line-clamp-3 md:text-left [&>a]:font-semibold [&>a]:text-primary">
                    <Linkify
                      options={{ target: '_blank', rel: 'noopener noreferrer' }}
                    >
                      {user.profile.bio.replaceAll('\n', ' ')}
                    </Linkify>
                  </pre>
                )}
                <Scope value="friends" fallback={<></>}>
                  <div className="mt-2 flex items-center">
                    <>
                      {currentUser && currentUser.id !== user.id && (
                        <>
                          <FriendsButton
                            friendUser={user}
                            initialFriendStatus={friendStatus}
                          />
                          <span className="mx-2">
                            <Square />
                          </span>
                        </>
                      )}

                      <Link
                        legacyBehavior
                        href={`/${user.customId || user.id}/friends`}
                      >
                        <a className="font-medium text-neutral-400">
                          {friendCount}{' '}
                          {formatter.pluralise('Friend', friendCount)}
                        </a>
                      </Link>

                      {currentUser && currentUser.id == user.id && (
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
                    </>
                  </div>
                </Scope>

                <Scope value="connections" fallback={<></>}>
                  <div className="mt-2 flex flex-row items-center gap-2">
                    <SpotifyLink path={`/user/${user.id}`} />
                    <AppleMusicLink />
                  </div>
                </Scope>
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
            <ImportRequiredScope value="streamStats">
              <ul className="grid w-full grid-cols-2 gap-4 md:w-4/6 md:grid-cols-4">
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

          <Section
            title="Top genres"
            description={`${
              isCurrentUser ? 'Your' : `${user.displayName}'s`
            } top genres ${ranges[range]}`}
            scope="topGenres"
          >
            <Scope value="topGenres">
              <ChipGroup
                className={clsx(topGenres.length === 0 && '!overflow-x-hidden')}
              >
                {topGenres.length > 0
                  ? topGenres.map((genre, i) => (
                      <Chip key={i}>
                        <Link legacyBehavior href={`/genre/${genre.genre.tag}`}>
                          <a onClick={() => event('USER_top_genre_click')}>
                            {genre.genre.tag}
                          </a>
                        </Link>
                      </Chip>
                    ))
                  : Array(8)
                      .fill(null)
                      .map((_v, i) => (
                        <Chip
                          className="shrink-0 animate-pulse text-transparent"
                          key={i}
                        >
                          {i.toString().repeat(i + (10 % 17))}
                        </Chip>
                      ))}
              </ChipGroup>
            </Scope>
          </Section>
          <Carousel gridMode={activeCarousel === 'tracks'} itemHeight={276}>
            <Section
              ref={topTracksRef}
              title="Top tracks"
              description={`${
                isCurrentUser ? 'Your' : formatter.nounify(user.displayName)
              } top tracks ${ranges[range]}`}
              scope="topTracks"
              toolbar={
                <div className="flex gap-1">
                  <SectionToolbarGridmode
                    callback={(gridMode) =>
                      handleGridModeCallback(gridMode, 'tracks')
                    }
                  />
                  <SectionToolbarCarouselNavigationButton
                    callback={() => event('USER_top_tracks_previous')}
                  />
                  <SectionToolbarCarouselNavigationButton
                    next
                    callback={() => event('USER_top_tracks_next')}
                  />
                  <SectionToolbarInfoMenu>
                    <ShareMenuItem
                      path={`/${user.customId ?? user.id}/tracks`}
                    />
                  </SectionToolbarInfoMenu>
                </div>
              }
            >
              <Scope value="topTracks">
                {/* <NotEnoughData data={topTracks}> */}

                <Carousel.Items>
                  {topTracks.length > 0
                    ? topTracks.map((item, i) => (
                        <Carousel.Item
                          key={i}
                          onClick={() => event('USER_top_track_click')}
                        >
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
              </Scope>
            </Section>
          </Carousel>

          <Carousel gridMode={activeCarousel === 'artists'} itemHeight={262}>
            <Section
              title="Top artists"
              ref={topArtistsRef}
              description={`${
                isCurrentUser ? 'Your' : formatter.nounify(user.displayName)
              } top artists ${ranges[range]}`}
              scope="topArtists"
              toolbar={
                <div className="flex gap-1">
                  <SectionToolbarGridmode
                    callback={(gridMode) =>
                      handleGridModeCallback(gridMode, 'artists')
                    }
                  />
                  <SectionToolbarCarouselNavigationButton
                    callback={() => event('USER_top_artist_previous')}
                  />
                  <SectionToolbarCarouselNavigationButton
                    next
                    callback={() => event('USER_top_artist_next')}
                  />
                  <SectionToolbarInfoMenu>
                    <ShareMenuItem
                      path={`/${user.customId ?? user.id}/artists`}
                    />
                  </SectionToolbarInfoMenu>
                </div>
              }
            >
              <Scope value="topArtists">
                {/* <NotEnoughData data={topArtists}> */}
                <Carousel.Items>
                  {topArtists.length > 0
                    ? topArtists.map((item, i) => (
                        <Carousel.Item
                          key={i}
                          onClick={() => event('USER_top_artist_click')}
                        >
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
              </Scope>
            </Section>
          </Carousel>

          {user.isPlus && (
            <Carousel gridMode={activeCarousel === 'albums'} itemHeight={255}>
              <Section
                title="Top albums"
                ref={topAlbumsRef}
                description={`${
                  isCurrentUser ? 'Your' : `${user.displayName}'s`
                } top albums ${ranges[range]}`}
                scope="topAlbums"
                toolbar={
                  <div className="flex gap-1">
                    <SectionToolbarGridmode
                      callback={(gridMode) =>
                        handleGridModeCallback(gridMode, 'albums')
                      }
                    />
                    <SectionToolbarCarouselNavigationButton
                      callback={() => event('USER_top_albums_previous')}
                    />
                    <SectionToolbarCarouselNavigationButton
                      next
                      callback={() => event('USER_top_albums_next')}
                    />
                    <SectionToolbarInfoMenu>
                      <ShareMenuItem
                        path={`/${user.customId ?? user.id}/albums`}
                      />
                    </SectionToolbarInfoMenu>
                  </div>
                }
              >
                <Scope value="topAlbums">
                  {/* <NotEnoughData data={topAlbums}> */}
                  <Carousel.Items>
                    {topAlbums && topAlbums.length > 0
                      ? topAlbums.map((item, i) => (
                          <Carousel.Item
                            key={i}
                            onClick={() => event('USER_top_album_click')}
                          >
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
                </Scope>
              </Section>
            </Carousel>
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
      </Scope.Context>
    </>
  );
};

export default User;
