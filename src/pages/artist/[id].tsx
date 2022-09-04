import type * as statsfm from '@statsfm/statsfm.js';
import type { SortOptions } from '@/hooks';
import { useLessOrAll, useApi, useSort } from '@/hooks';
import type { GetServerSideProps, NextPage } from 'next';
import { Avatar } from '@/components/Avatar';
import Head from 'next/head';
import { Chip, ChipGroup } from '@/components/Chip';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import { useEffect, useState } from 'react';
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
import { MdSort } from 'react-icons/md';
import { SectionToolbarCarouselNavigationButton } from '@/components/SectionToolbarCarouselNavigationButton';

const MoreTracks = ({
  artist,
  tracks,
}: {
  artist: statsfm.Artist;
  tracks: statsfm.Track[];
}) => {
  const api = useApi();
  const [currentUserTop, setCurrentUserTop] = useState<statsfm.TopTrack[]>([]);

  const limit = 8;

  useEffect(() => {
    api.users
      .topTracksFromArtist('me', artist.id)
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

  const [topTracks, setTopTracks] = useState<statsfm.Track[]>([]);
  // const [albums, setAlbums] = useState<statsfm.Album[]>([]);
  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [related, setRelated] = useState<statsfm.Artist[]>([]);
  const [streams, setStreams] = useState<statsfm.Stream[]>([]);

  useEffect(() => {
    (async () => {
      setTopTracks(await api.artists.tracks(artist.id));
      // setAlbums(await api.artists.albums(artist.id));
      setTopListeners(
        await api.http
          .get<statsfm.TopUser[]>(`/artists/${artist.id}/top/listeners`)
          .then((res) => res.data.items)
      );
      setRelated(await api.artists.related(artist.id));
      setStreams(await api.users.artistStreams('martijn', artist.id));
    })();
  }, []);

  return (
    <>
      <Head>
        <title>{artist.name}</title>
      </Head>

      <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
        <Avatar src={artist.image} name={artist.name} size="4xl" />

        <div className="flex flex-col justify-end">
          <h1 className="text-center md:text-left">{artist.name}</h1>

          <span className="text-center text-lg md:text-left">
            {artist.followers.toLocaleString()} followers
          </span>
        </div>
      </section>

      <section>
        <ChipGroup>
          {artist.genres.map((genre, i) => (
            <Chip key={i}>{genre}</Chip>
          ))}
        </ChipGroup>
      </section>

      <Carousel slide={6}>
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

      <Carousel slide={6}>
        <Section
          title="Top listeners"
          description={`People who love ${artist.name}`}
          toolbar={
            <div className="flex gap-1">
              <SectionToolbarCarouselNavigationButton />
              <SectionToolbarCarouselNavigationButton next />
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

      <Carousel slide={6} rows={3}>
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

      <MoreTracks artist={artist} tracks={topTracks} />

      <Section
        title="Your streams"
        description={`Your streams featuring ${artist.name}`}
      >
        <ul>
          {streams.length > 0 ? (
            <RecentStreams streams={streams} />
          ) : (
            Array(10)
              .fill(null)
              .map((_n, i) => (
                <li key={i}>
                  <TrackListRowSkeleton />
                </li>
              ))
          )}
        </ul>
      </Section>
    </>
  );
};

export default Artist;
