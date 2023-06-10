import { Carousel } from '@/components/Carousel';
import { Container } from '@/components/Container';
import { AlbumSearchCard } from '@/components/Search/AlbumSearchCard';
import { ArtistSearchCard } from '@/components/Search/ArtistSearchCard';
import { SearchCardSkeleton } from '@/components/Search/SearchCardSkeleton';
import { TrackSearchCard } from '@/components/Search/TrackSearchCard';
import { UserSearchCard } from '@/components/Search/UserSearchCard';
import {
  Section,
  SectionToolbarCarouselNavigation,
} from '@/components/Section';
import { Title } from '@/components/Title';
import { useApi } from '@/hooks';
import { toProperCase } from '@/utils/toProperCase';
import { event } from 'nextjs-google-analytics';
import {
  SearchTypes,
  type Album,
  type Artist,
  type Track,
  type UserPublic,
} from '@statsfm/statsfm.js';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

type Props = {
  query: string;
};

type SearchListProps = (
  | { type: 'artist'; data: Artist[] }
  | { type: 'album'; data: Album[] }
  | { type: 'track'; data: Track[] }
  | { type: 'user'; data: UserPublic[] }
) & { query: string; loading: boolean };

const loadingArray = (type: SearchListProps['type']) =>
  new Array(10).fill(null).map(() => (
    <Carousel.Item key={(Math.random() + 1).toString(36).substring(7)}>
      <SearchCardSkeleton type={type} />
    </Carousel.Item>
  ));

const SearchList: FC<SearchListProps> = ({ type, data, query, loading }) => {
  if (!data.length && !loading) {
    return (
      <Section
        title={`${toProperCase(type)}s`}
        description={`No ${type}s found matching "${query}"`}
      >
        {null}
      </Section>
    );
  }
  const mappedData = data.map((value) => (
    <Carousel.Item key={value.id}>
      {type === 'artist' && <ArtistSearchCard {...(value as Artist)} />}
      {type === 'album' && <AlbumSearchCard {...(value as Album)} />}
      {type === 'track' && <TrackSearchCard {...(value as Track)} />}
      {type === 'user' && <UserSearchCard {...(value as UserPublic)} />}
    </Carousel.Item>
  ));
  return (
    <Carousel>
      <Section
        title={`${toProperCase(type)}s`}
        description={`${toProperCase(type)}s matching "${query}"`}
        toolbar={
          <div className="flex gap-1">
            <SectionToolbarCarouselNavigation
              callback={() => event(`SEARCH_${type}_previous`)}
            />
            <SectionToolbarCarouselNavigation
              next
              callback={() => event(`SEARCH_${type}_next`)}
            />
          </div>
        }
      >
        <Carousel.Items>
          {loading ? loadingArray(type) : mappedData}
        </Carousel.Items>
      </Section>
    </Carousel>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  return {
    props: {
      query: ctx.query.query ? ctx.query.query.toString() : '',
    },
  };
};

const SearchPage: NextPage<Props> = ({ query }) => {
  const router = useRouter();
  const api = useApi();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query || query.length < 1) {
      router.push('/');
    }
  }, [query]);

  useEffect(() => {
    (async () => {
      const data = await api.search.searchElastic(
        query,
        [
          SearchTypes.ALBUM,
          SearchTypes.ARTIST,
          SearchTypes.TRACK,
          SearchTypes.USER,
        ],
        { limit: 50 }
      );
      setArtists(data.artists ?? []);
      setAlbums(data.albums ?? []);
      setTracks(data.tracks ?? []);
      setUsers(data.users ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <Container className="pt-20">
      <Title>Searching for {query}</Title>

      <h1>Searching for {query}</h1>
      <SearchList
        type="artist"
        data={artists}
        query={query}
        loading={loading}
      />
      <SearchList type="album" data={albums} query={query} loading={loading} />

      <SearchList type="track" data={tracks} query={query} loading={loading} />

      <SearchList type="user" data={users} query={query} loading={loading} />
    </Container>
  );
};

export default SearchPage;
