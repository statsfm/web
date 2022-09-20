import { useApi } from '@/hooks';
import type { GetServerSideProps, NextPage } from 'next';
import { Chip, ChipGroup } from '@/components/Chip';
import { useEffect } from 'react';
import { Container } from '@/components/Container';
import type { Artist, Genre } from '@statsfm/statsfm.js';
import { Section } from '@/components/Section';
import { Avatar } from '@/components/Avatar';
import Link from 'next/link';

type Props = {
  tag: string;
  genre: Omit<Genre, 'artists'> & { artists: Artist[] };
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi();
  const tag = ctx.params?.tag?.toString();

  if (!tag) {
    throw new Error('no param tag recieved');
  }

  const genre = (await api.genres.get(tag)) as Omit<Genre, 'artists'> & {
    artists: Artist[];
  };

  return {
    props: {
      tag,
      genre,
    },
  };
};

const GenrePage: NextPage<Props> = ({ tag, genre }) => {
  // const api = useApi();

  useEffect(() => {
    // (async () => {
    //   setTopTracks(await api.artists.tracks(artist.id));
    //   // setAlbums(await api.artists.albums(artist.id));
    //   setTopListeners(
    //     await api.http
    //       .get<statsfm.TopUser[]>(`/artists/${artist.id}/top/listeners`)
    //       .then((res) => res.data.items)
    //   );
    //   setRelated(await api.artists.related(artist.id));
    //   setStreams(await api.users.artistStreams('martijn', artist.id));
    // })();
  }, []);

  return (
    <>
      <div className="bg-bodySecundary pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
            <div className="flex flex-col justify-end">
              <h1 className="text-center text-5xl font-extrabold capitalize md:text-left">
                {tag}
              </h1>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-8">
        <Section title="Related Genres">
          <ChipGroup>
            {genre &&
              genre.related.map((genre, i) => <Chip key={i}>{genre.tag}</Chip>)}
          </ChipGroup>
        </Section>

        <Section title="Top Artists">
          <ul className="grid grid-cols-5 gap-4 gap-y-12">
            {genre.artists.map((artist) => (
              <li key={artist.name}>
                <Link href={`/artist/${artist.id}`}>
                  <a className="flex flex-col items-center">
                    <Avatar name={artist.name} src={artist.image} size="4xl" />
                    <h4 className="mt-2 text-center">{artist.name}</h4>
                    <p className="my-0">
                      {Intl.NumberFormat('en', { notation: 'compact' }).format(
                        artist.followers
                      )}{' '}
                      Followers
                    </p>
                    <p className="mt-1 text-center text-sm font-medium line-clamp-1">
                      {artist.genres.map((genre, i) => (
                        <span key="a">
                          <Link href={`/genre/${genre}`}>
                            <a className="transition-colors hover:text-white">
                              {genre}
                            </a>
                          </Link>

                          {i !== artist.genres.length - 1 && ', '}
                        </span>
                      ))}
                    </p>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </>
  );
};

export default GenrePage;
