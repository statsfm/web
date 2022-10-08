import type * as statsfm from '@statsfm/statsfm.js';
import type { SortOptions } from '@/hooks';
import { useAuth, useLessOrAll, useApi, useSort } from '@/hooks';
import type { GetServerSideProps, NextPage } from 'next';
import { Avatar } from '@/components/Avatar';
import { Chip, ChipGroup } from '@/components/Chip';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { useEffect, useMemo, useState } from 'react';
import { TrackCard, TrackCardSkeleton } from '@/components/TrackCard';
import {
  RelatedArtistCard,
  RelatedArtistCardSkeleton,
} from '@/components/RelatedArtistCard';
import { TrackListRow, TrackListRowSkeleton } from '@/components/TrackListRow';
import TopListenerCard from '@/components/TopListenerCard/TopListenerCard';
import { TopListenerCardSkeleton } from '@/components/TopListenerCard';
import { RecentStreams } from '@/components/RecentStreams';
import { Menu } from '@/components/Menu';
import { MdOutlinePreview, MdSort } from 'react-icons/md';
import { SectionToolbarCarouselNavigationButton } from '@/components/SectionToolbarCarouselNavigationButton';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Title } from '@/components/Title';
import { supportUrls } from '@/utils/supportUrls';
import { SectionToolbarInfoMenu } from '@/components/SectionToolbarInfoMenu';
import Head from 'next/head';
import { StatsCard } from '@/components/StatsCard';

const MoreTracks = ({
  artist,
  tracks,
  user,
}: {
  artist: statsfm.Artist;
  tracks: statsfm.Track[];
  user: statsfm.UserPrivate;
}) => {
  const api = useApi();
  const [currentUserTop, setCurrentUserTop] = useState<statsfm.TopTrack[]>([]);

  const limit = 8;

  useEffect(() => {
    api.users
      .topTracksFromArtist(user.id, artist.id)
      .then((res) => setCurrentUserTop(res));
  }, []);

  // find the stream count of the signed in user
  const streams = (id: number) =>
    currentUserTop.find((stream) => stream.track.id === id)?.streams ?? 0;

  const sortOptions: SortOptions<statsfm.Track>[] = [
    {
      label: 'Popularity',
      value: 'popularity',
      compare: (a, b) => b.spotifyPopularity - a.spotifyPopularity,
    },
    {
      label: 'Streams',
      value: 'streams',
      compare: (a, b) => streams(b.id) - streams(a.id),
    },
    {
      label: 'Duration',
      value: 'duration',
      compare: (a, b) => b.durationMs - a.durationMs,
    },
  ];

  const { sorted, setSortKey } = useSort(tracks, sortOptions);
  const { data, toggle, showAll } = useLessOrAll(sorted, limit);

  const handleSortChange = (value: string) => {
    setSortKey(value);
  };

  return (
    <Section
      title="More tracks"
      description={`More tracks by ${artist.name}`}
      toolbar={
        <Menu>
          <Menu.Button>
            <MdSort />
            Sort
          </Menu.Button>

          <Menu.Items>
            {sortOptions.map((option, i) => (
              <Menu.Item onClick={handleSortChange} key={i}>
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      }
    >
      <ul>
        {tracks.length > 0
          ? data.map((item, i) => (
              <li key={i}>
                <TrackListRow streams={streams(item.id)} track={item} />
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

      {tracks.length > limit && (
        <button
          className="py-3 font-bold uppercase text-text-grey"
          onClick={toggle}
        >
          {showAll ? 'show less' : 'show all'}
        </button>
      )}
    </Section>
  );
};

interface Props {
  artist: statsfm.Artist;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi();
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  // TODO: create some sort of parseId function
  const artist = await api.artists.get(parseInt(id, 10));

  return {
    props: {
      artist,
    },
  };
};

const Artist: NextPage<Props> = ({ artist }) => {
  const api = useApi();
  const { user } = useAuth();

  const [topTracks, setTopTracks] = useState<statsfm.Track[]>([]);
  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [related, setRelated] = useState<statsfm.Artist[]>([]);
  const [streams, setStreams] = useState<statsfm.Stream[]>([]);
  const [stats, setStats] = useState<statsfm.StreamStats | null>(null);

  useEffect(() => {
    (async () => {
      setTopTracks(await api.artists.tracks(artist.id));
      setTopListeners(
        await api.http
          .get<statsfm.TopUser[]>(`/artists/${artist.id}/top/listeners`)
          .then((res) => res.data.items)
      );
      setRelated(await api.artists.related(artist.id));
    })();
  }, [artist]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setStreams(await api.users.artistStreams(user.id, artist.id));
      setStats(await api.users.artistStats(user.id, artist.id));
    })();
  }, [user]);

  const statsResult = useMemo(() => {
    if (!user || !stats) return { count: '-', duration: '-' };

    const duration = `${Math.floor(stats.durationMs / 1000 / 60)}m`;
    const count = `${stats.count.toLocaleString()}x`;
    return { count, duration };
  }, [user, stats]);

  return (
    <>
      <Title>{`${artist.name} music, stats and more`}</Title>
      <Head>
        <meta property="og:image" content={artist.image} />
        <meta
          property="og:image:alt"
          content={`${artist.name}'s profile picture`}
        />
        <meta property="og:image:width" content="240" />
        <meta property="og:image:height" content="240" />
        <meta property="og:title" content={`${artist.name} | stats.fm`} />
        <meta
          property="og:description"
          content={`View ${artist.name} on stats.fm`}
        />
        <meta property="twitter:card" content="summary" />
      </Head>

      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
            <Avatar src={artist.image} name={artist.name} size="4xl" />

            <div className="flex flex-col justify-end">
              <h1 className="text-center font-extrabold md:text-left">
                {artist.name}
              </h1>

              <span className="text-center text-lg md:text-left">
                {artist.followers.toLocaleString('en')} followers
              </span>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-8">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <li>
            <StatsCard
              value={statsResult.count}
              label={
                statsResult.count
                  ? 'total times streamed'
                  : 'login to see your stats'
              }
            />
          </li>
          <li>
            <StatsCard
              value={statsResult.duration}
              label={
                statsResult.duration
                  ? 'total minutes streamed'
                  : 'login to see your stats'
              }
            />
          </li>
          <li>
            <StatsCard
              value={(artist.spotifyPopularity / 10).toLocaleString()}
              label={'0-10 popularity'}
            />
          </li>
        </ul>

        <Section title="Genres">
          <ChipGroup>
            {artist.genres.map((genre, i) => (
              <Chip key={i}>
                <Link href={`/genre/${genre}`}>{genre}</Link>
              </Chip>
            ))}
          </ChipGroup>
        </Section>

        <Carousel>
          <Section
            title="Popular tracks"
            description={`The most popular tracks by ${artist.name}`}
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigationButton />
                <SectionToolbarCarouselNavigationButton next />
              </div>
            }
          >
            <Carousel.Items>
              {topTracks.length > 0
                ? topTracks.map((item, i) => (
                    <Carousel.Item key={i}>
                      <TrackCard track={item} />
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
          </Section>
        </Carousel>

        {/* <Section title="Albums" description={`Albums featuring ${artist.name}`}>
        <Carousel gap={16} rows={1}>
          {albums.length > 0
            ? albums.map((album, i) => (
                <li key={i}>
                  <AlbumCard album={album} />
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
      </Section> */}

        <Carousel>
          <Section
            title="Top listeners"
            description={`People who love ${artist.name}`}
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigationButton />
                <SectionToolbarCarouselNavigationButton next />
                <SectionToolbarInfoMenu
                  description="Learn more about what top listeners are and how they're calculated"
                  link={supportUrls.artist.top_listeners}
                >
                  <Menu.Item>
                    <Menu>
                      <Menu.Button>
                        <MdOutlinePreview className="text-white" /> Display
                        options
                      </Menu.Button>

                      <Menu.Items>
                        <Menu.Item>
                          Learn more about blablabalbalabballabl
                        </Menu.Item>
                        <Menu.Item>
                          Learn more about blablabalbalabballabl
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </Menu.Item>

                  <Menu.Item>gdasgkdasg</Menu.Item>
                </SectionToolbarInfoMenu>
              </div>
            }
          >
            <Carousel.Items>
              {topListeners.length > 0
                ? topListeners.map((item, i) => (
                    <Carousel.Item key={i}>
                      <TopListenerCard {...item} />
                    </Carousel.Item>
                  ))
                : Array(10)
                    .fill(null)
                    .map((_n, i) => (
                      <Carousel.Item key={i}>
                        <TopListenerCardSkeleton />
                      </Carousel.Item>
                    ))}
            </Carousel.Items>
          </Section>
        </Carousel>

        <Carousel slide={1} rows={3}>
          <Section
            title="Related artists"
            description="Artists that fans might also like"
            toolbar={
              <div className="flex gap-1">
                <SectionToolbarCarouselNavigationButton />
                <SectionToolbarCarouselNavigationButton next />
              </div>
            }
          >
            <Carousel.Items>
              {related.length > 0
                ? related.map((item, i) => (
                    <Carousel.Item key={i}>
                      <RelatedArtistCard {...item} />
                    </Carousel.Item>
                  ))
                : Array(20)
                    .fill(null)
                    .map((_n, i) => (
                      <Carousel.Item key={i}>
                        <RelatedArtistCardSkeleton />
                      </Carousel.Item>
                    ))}
            </Carousel.Items>
          </Section>
        </Carousel>
        {user && <MoreTracks artist={artist} tracks={topTracks} user={user} />}

        <Section
          title="Your streams"
          description={`Your streams featuring ${artist.name}`}
        >
          {({ headerRef }) => (
            <RecentStreams headerRef={headerRef} streams={streams} />
          )}
        </Section>
      </Container>
    </>
  );
};

export default Artist;
