import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import type { GetServerSideProps, NextPage } from 'next';
import * as statsfm from '@statsfm/statsfm.js';

// components
import { ArtistCard, ArtistCardSkeleton } from '@/components/ArtistCard';
import { Section } from '@/components/Section';
import { SegmentedControls } from '@/components/SegmentedControls';
import { StatsCard, StatsCardSkeleton } from '@/components/StatsCard';
import { TrackCard, TrackCardSkeleton } from '@/components/TrackCard';
import { Carousel } from '@/components/Carousel';
import { Avatar } from '@/components/Avatar';
import { MdVisibilityOff } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@/components/Skeleton';
import { TrackListRow, TrackListRowSkeleton } from '@/components/TrackListRow';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/hooks';
import Head from 'next/head';

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

  const user = await api.users.get(id);

  return {
    props: {
      user,
    },
  };
};

const PlusBadge = () => (
  <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-sm text-primary">
    Spotistats Plus
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

const ImportRequiredScope = ({ children }: PropsWithChildren) => {
  const user = useUserContext('ImportRequiredScope');
  // the currently logged in user
  const { user: currentUser } = useAuth();

  if (user.hasImported) {
    return <>{children}</>;
  }

  // TODO: look for a better way to implement getting the user context
  if (user.id === currentUser?.id || user.id === 'me') {
    return (
      <div className="grid w-full place-items-center">
        {/* <Icon path={mdiFileImportOutline} /> */}

        {/* TODO: add a blurred feature preview */}
        <p className="m-0 text-text-grey">
          This feature requires{' '}
          {/* TODO: replace the link with a router link */}
          <a className="underline" href="https://stats.fm/import">
            import of streams
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="grid w-full place-items-center">
      <p className="m-0 text-text-grey">
        Ask {user.displayName} to{' '}
        <a className="underline" href="https://stats.fm/import">
          import their streaming history
        </a>{' '}
        to view this
      </p>
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
  const [topTracks, setTopTracks] = useState<statsfm.TopTrack[]>([]);
  const [topArtists, setTopArtists] = useState<statsfm.TopArtist[]>([]);
  const [topAlbums, setTopAlbums] = useState<statsfm.TopAlbum[]>([]);
  const [recentStreams, setRecentStreams] = useState<
    statsfm.RecentlyPlayedTrack[]
  >([]);

  const isCurrentUser = currentUser?.id === user.id;

  useEffect(() => {
    setStats([]);
    setTopTracks([]);
    setTopArtists([]);
    setTopAlbums([]);

    const load = async () => {
      if (user.privacySettings?.streamStats) {
        const stats = await api.users.stats(user.id, { range });

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
            value: Math.round(
              dayjs.duration(stats.durationMs).asHours()
            ).toLocaleString(),
          },
        ]);
      }

      if (user.privacySettings?.topTracks)
        setTopTracks(await api.users.topTracks(user.id, { range }));
      if (user.privacySettings?.topArtists)
        setTopArtists(await api.users.topArtists(user.id, { range }));
      if (user.privacySettings?.topAlbums)
        setTopAlbums(await api.users.topAlbums(user.id, { range }));
    };

    load();
  }, [range]);

  // TODO: improvements
  useEffect(() => {
    const load = async () => {
      if (user.privacySettings?.recentlyPlayed)
        setRecentStreams(await api.users.recentlyStreamed(user.id));
    };

    load();
  }, []);

  const handleSegmentSelect = (value: string) => {
    setRange(statsfm.Range[value.toUpperCase() as keyof typeof statsfm.Range]);
  };

  return (
    <>
      {/* TODO: move to a hook so we can use a base title */}
      <Head>
        <title>{user.displayName}</title>
      </Head>

      <UserContext.Provider value={user}>
        <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
          <Avatar src={user.image} name={user.displayName} size="4xl" />

          <div className="flex flex-col justify-end">
            <span className="text-center text-lg font-medium md:text-left">
              {user.privacySettings?.profile && user.profile?.pronouns}{' '}
              {user.isPlus && <PlusBadge />}
            </span>

            <h1 className="text-center md:text-left">{user.displayName}</h1>

            {user.privacySettings?.profile && (
              <span className="text-center text-xl font-medium md:text-left">
                {user.profile?.bio}
              </span>
            )}
          </div>
        </section>

        <section className="flex flex-col justify-between gap-5 md:flex-row-reverse">
          <SegmentedControls
            segments={[
              { label: '4 weeks', value: statsfm.Range.WEEKS, ref: useRef() },
              { label: '6 months', value: statsfm.Range.MONTHS, ref: useRef() },
              {
                label: 'lifetime',
                value: statsfm.Range.LIFETIME,
                ref: useRef(),
              },
            ]}
            onSegmentSelect={handleSegmentSelect}
          />

          <ImportRequiredScope>
            <PrivacyScope scope="streamStats">
              <ul className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
                {stats.length > 0
                  ? stats.map((item, i) => (
                      <li key={i}>
                        <StatsCard {...item} />
                      </li>
                    ))
                  : Array(3)
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

        <Section
          title="Top tracks"
          description={`${
            isCurrentUser ? 'Your' : `${user.displayName}'s`
          } top tracks from the past ${ranges[range]}`}
        >
          <PrivacyScope scope="topTracks">
            {/* <NotEnoughData data={topTracks}> */}
            <Carousel gap={16} rows={1}>
              {topTracks.length > 0
                ? topTracks.map((item, i) => (
                    <li key={i}>
                      <TrackCard {...item} />
                    </li>
                  ))
                : Array(10)
                    .fill(null)
                    .map((_n, i) => (
                      <li key={i}>
                        <TrackCardSkeleton />
                      </li>
                    ))}
            </Carousel>
            {/* </NotEnoughData> */}
          </PrivacyScope>
        </Section>

        <Section
          title="Top artists"
          // TODO: pluralization
          description={`${
            isCurrentUser ? 'Your' : `${user.displayName}'s`
          } top artists from the past ${ranges[range]}`}
        >
          <PrivacyScope scope="topArtists">
            {/* <NotEnoughData data={topArtists}> */}
            <Carousel gap={16} rows={1}>
              {topArtists.length > 0
                ? topArtists.map((item, i) => (
                    <li key={i}>
                      <ArtistCard {...item} />
                    </li>
                  ))
                : Array(10)
                    .fill(null)
                    .map((_n, i) => (
                      <li key={i}>
                        <ArtistCardSkeleton />
                      </li>
                    ))}
            </Carousel>
            {/* </NotEnoughData> */}
          </PrivacyScope>
        </Section>

        <Section
          title="Top albums"
          description={`${
            isCurrentUser ? 'Your' : `${user.displayName}'s`
          } top albums from the past ${ranges[range]}`}
        >
          <PrivacyScope scope="topAlbums">
            {/* <NotEnoughData data={topAlbums}> */}
            <Carousel rows={1} gap={16}>
              {topAlbums && topAlbums.length > 0
                ? topAlbums.map((item, i) => (
                    // TODO: move to separate component
                    <li key={i}>
                      <Link href={`/album/${item.album.id}`}>
                        <div className="w-40">
                          <div className="aspect-square w-full group-hover:opacity-90">
                            {item.album.image && (
                              <Image
                                src={item.album.image}
                                width={160}
                                height={160}
                                alt={item.album.name}
                                className="aspect-square"
                              />
                            )}
                          </div>
                          <div className="mt-2">
                            <h4 className="line-clamp-2">{item.album.name}</h4>
                            <p className="m-0 truncate">
                              {Math.floor(
                                dayjs.duration(item.playedMs!, 'ms').asMinutes()
                              ).toLocaleString()}{' '}
                              minutes • {item.streams} streams
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))
                : Array(10)
                    .fill(null)
                    .map((_n, i) => (
                      <li key={i}>
                        <Skeleton.Image width="10rem" height="10rem" />
                        <div className="mt-2 flex flex-col gap-2">
                          <Skeleton.Text width="9rem" />
                          <Skeleton.Text width="6.5rem" />
                        </div>
                      </li>
                    ))}
            </Carousel>
            {/* </NotEnoughData> */}
          </PrivacyScope>
        </Section>

        <Section
          title="Recent streams"
          description={`${
            isCurrentUser ? 'Your' : `${user.displayName}'s`
          } recently played tracks`}
        >
          <PrivacyScope scope="recentlyPlayed">
            {/* <NotEnoughData data={recentStreams.value}> */}
            <ul>
              {recentStreams.length > 0
                ? recentStreams.map((item, i) => (
                    <li key={i}>
                      <TrackListRow {...item} />
                    </li>
                  ))
                : Array(8)
                    .fill(null)
                    .map((_n, i) => (
                      <li key={i}>
                        <TrackListRowSkeleton />
                      </li>
                    ))}
            </ul>

            {/* </NotEnoughData> */}
          </PrivacyScope>
        </Section>
      </UserContext.Provider>
    </>
  );
};

export default User;
