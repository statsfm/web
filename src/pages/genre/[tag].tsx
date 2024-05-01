import type { GetServerSideProps, NextPage } from 'next';
import { Chip, ChipGroup } from '@/components/Chip';
import { Container } from '@/components/Container';
import type { Artist, Genre } from '@/utils/statsfm';
import { Section } from '@/components/Section/Section';
import { Avatar } from '@/components/Avatar';
import Link from 'next/link';
import { Title } from '@/components/Title';
import { useMedia } from 'react-use';
import { useMemo } from 'react';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser, getApiInstance } from '@/utils/ssrUtils';
import formattter from '@/utils/formatter';

type Props = SSRProps & {
  tag: string;
  genre: Omit<Genre, 'artists'> & { artists: Artist[] };
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const tag = ctx.params?.tag?.toString();

  if (!tag) {
    throw new Error('no param tag recieved');
  }

  const genre = (await api.genres.get(encodeURIComponent(tag))) as Omit<
    Genre,
    'artists'
  > & {
    artists: Artist[];
  };

  // this is the wackiest hack, genre should throw or be optional if it doesn't exist
  if (
    genre.related.length === 0 &&
    genre.sub.length === 0 &&
    genre.artists.length === 0
  )
    return { notFound: true };

  const user = await fetchUser(ctx);

  return {
    props: {
      tag,
      genre,
      user,
    },
  };
};

const GenrePage: NextPage<Props> = ({ tag, genre }) => {
  // deduping artists by name
  const artists = useMemo(() => {
    const existingArtists: string[] = [];
    const dedupedArtists = genre.artists.filter((artist) => {
      if (existingArtists.includes(artist.name)) {
        return false;
      }

      existingArtists.push(artist.name);
      return true;
    });

    return dedupedArtists;
  }, [genre]);

  const mobile = useMedia('(max-width: 640px)');
  return (
    <>
      <Title>{tag}</Title>
      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pb-10 pt-24 md:flex-row">
            <div className="flex flex-col justify-end">
              <h1 className="text-center text-5xl font-extrabold capitalize md:text-left">
                {tag}
              </h1>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-4">
        {genre.sub.length > 0 && (
          <Section title="Sub Genres">
            <ChipGroup>
              {genre &&
                genre.sub.map((genre, i) => (
                  <Chip key={i}>
                    <Link legacyBehavior href={`/genre/${genre.tag}`}>
                      {genre.tag}
                    </Link>
                  </Chip>
                ))}
            </ChipGroup>
          </Section>
        )}
        {genre.related.length > 0 && (
          <Section title="Related Genres">
            <ChipGroup>
              {genre &&
                genre.related
                  .filter(
                    (g1) =>
                      genre.sub.findIndex((g2) => g1.tag === g2.tag) === -1,
                  )
                  .map((genre, i) => (
                    <Chip key={i}>
                      <Link legacyBehavior href={`/genre/${genre.tag}`}>
                        {genre.tag}
                      </Link>
                    </Chip>
                  ))}
            </ChipGroup>
          </Section>
        )}

        <Section title="Top Artists">
          <ul className="grid grid-cols-2 gap-4 gap-y-12 md:grid-cols-3 lg:grid-cols-5 ">
            {artists.map((artist) => (
              <li key={artist.name}>
                <Link legacyBehavior href={`/artist/${artist.id}`}>
                  <a className="flex flex-col items-center">
                    <Avatar
                      name={artist.name}
                      src={artist.image}
                      size={mobile ? '2xl' : '4xl'}
                    />
                    <h4 className="mt-2 text-center">{artist.name}</h4>
                    <p className="my-0">
                      {formattter.formatNumberCompact(artist.followers)}{' '}
                      Followers
                    </p>
                  </a>
                </Link>
                <p className="mt-1 line-clamp-1 text-center text-sm font-medium">
                  {artist.genres.map((genre, i) => (
                    <span key={genre + artist}>
                      <Link legacyBehavior href={`/genre/${genre}`}>
                        <a className="transition-colors hover:text-white">
                          {genre}
                        </a>
                      </Link>

                      {i !== artist.genres.length - 1 && ', '}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </>
  );
};

export default GenrePage;
