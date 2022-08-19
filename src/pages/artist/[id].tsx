import type * as statsfm from '@statsfm/statsfm.js';
import type { SortOptions } from '@/hooks';
import { useLessOrAll, useApi, useSort } from '@/hooks';
import type { GetServerSideProps, NextPage } from 'next';
import { Avatar } from '@/components/Avatar';
import Head from 'next/head';
import { Chip, ChipGroup } from '@/components/Chip';
import { Section } from '@/components/Section';
import { Carousel } from '@/components/Carousel';
import type { ChangeEventHandler } from 'react';
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

  const handleSortChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSortKey(e.target.value);
  };

  return (
    <Section
      title="More tracks"
      description={`More tracks by ${artist.name}`}
      rightHeaderContent={
        // TODO: replace with a Menu
        <select
          name="sort"
          id="sort"
          className="cursor-pointer appearance-none rounded-xl bg-foreground p-2 font-semibold"
          onChange={handleSortChange}
        >
          {sortOptions.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [related, setRelated] = useState<statsfm.Artist[]>([]);
  const [streams, setStreams] = useState<statsfm.Stream[]>([]);

  useEffect(() => {
    (async () => {
      setTopTracks(await api.artists.tracks(artist.id));
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

      <Section
        title="Popular tracks"
        description={`The most popular tracks by ${artist.name}`}
      >
        <Carousel gap={16} rows={1}>
          {topTracks.length > 0
            ? topTracks.map((item, i) => (
                <li key={i}>
                  <TrackCard track={item} />
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
      </Section>

      <Section
        title="Top listeners"
        description={`People who love ${artist.name}`}
      >
        <Carousel gap={16} rows={1}>
          {topListeners.length > 0
            ? topListeners.map((item, i) => (
                <li key={i}>
                  <TopListenerCard {...item} />
                </li>
              ))
            : Array(10)
                .fill(null)
                .map((_n, i) => (
                  <li key={i}>
                    <TopListenerCardSkeleton />
                  </li>
                ))}
        </Carousel>
      </Section>

      <Section
        title="Related artists"
        description="Artists that fans might also like"
      >
        <Carousel rows={3} gap={16} className="snap-x snap-mandatory">
          {related.length > 0
            ? related.map((item, i) => (
                <li key={i}>
                  <RelatedArtistCard {...item} />
                </li>
              ))
            : Array(20)
                .fill(null)
                .map((_n, i) => (
                  <li key={i}>
                    <RelatedArtistCardSkeleton />
                  </li>
                ))}
        </Carousel>
      </Section>

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
