import { Container } from '@/components/Container';
import type { SSRProps } from '@/utils/ssrUtils';
import { getApiInstance, fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { MdChevronLeft, MdDiscFull } from 'react-icons/md';
import type * as statsfm from '@/utils/statsfm';
import { Title } from '@/components/Title';
import { Section } from '@/components/Section/Section';
import { useApi, useAuth } from '@/hooks';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from '@/components/Spinner';
import { RecentStreams } from '@/components/RecentStreams';
import clsx from 'clsx';
import { useRouter } from 'next/router';

const Toolbar: FC<{ closeCallback: () => void }> = ({ closeCallback }) => (
  <div>
    <button
      aria-label="go back"
      className={clsx(
        'mr-4 rounded-full bg-foreground p-2 ring-neutral-500 transition-all',
        // moved from the global css file
        'focus-within:ring-2 focus:outline-none focus:ring-2 hover:ring-2',
      )}
      onClick={() => closeCallback()}
    >
      <MdChevronLeft className="fill-white" />
    </button>
  </div>
);

type Props = SSRProps & {
  artist: statsfm.Artist;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { identityToken } = ctx.req.cookies;
  const api = getApiInstance(identityToken);
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  let artist;
  try {
    artist = await api.artists.get(parseInt(id, 10));
  } catch (e) {
    return { notFound: true };
  }

  const user = await fetchUser(ctx);

  return {
    props: {
      user,
      artist,
    },
  };
};

const ArtistStreamsPage: NextPage<Props> = ({ artist }) => {
  const api = useApi();
  const router = useRouter();
  const { user } = useAuth();

  const [recentStreams, setRecentStreams] = useState<statsfm.Stream[]>([]);
  const [loadMore, setLoadMore] = useState(true);

  const callbackRef = async () => {
    const lastEndTime = recentStreams[recentStreams.length - 1]
      ?.endTime as any as string;

    const streams = await api.users.artistStreams(user!.id, artist.id, {
      limit: 200,
      before: new Date(lastEndTime).getTime() || new Date().getTime(),
    });

    if (streams.length === 0) setLoadMore(false);
    setRecentStreams([...(recentStreams || []), ...streams.slice(1)]);
  };

  return (
    <>
      <Title>{`Your streams`}</Title>
      <div className="relative z-[31] bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pb-10 pt-24 md:flex-row md:items-start">
            <div className="flex w-full flex-col justify-end">
              <Link legacyBehavior href={`/artist/${artist.id}`}>
                <a className="-mb-3 flex items-center text-lg text-white">
                  <MdChevronLeft className="-mr-1 block h-12 w-6 text-white" />
                  back to {artist.name}
                </a>
              </Link>
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-left">
                Your streams featuring {artist.name}
              </h1>
            </div>
          </section>
        </Container>
      </div>
      <Container>
        <Section
          headerStyle="!flex-row-reverse -mt-24 z-30 relative"
          title={`back to ${artist.name}`}
          toolbar={
            <Toolbar
              closeCallback={() => router.push(`/artist/${artist.id}`)}
            />
          }
        >
          {({ headerRef }) => (
            <>
              <InfiniteScroll
                loadMore={callbackRef}
                hasMore={loadMore}
                loader={
                  <Spinner
                    key="spinner"
                    className="!mx-auto my-10 fill-primary !text-foreground"
                  />
                }
                threshold={2000}
                useWindow={true}
              >
                <RecentStreams
                  loading={null}
                  headerRef={headerRef}
                  streams={recentStreams}
                />
              </InfiniteScroll>
              {!loadMore && (
                <div className="grid w-full place-items-center py-20">
                  <MdDiscFull />
                  <p className="m-0 text-text-grey">No streams to load!</p>
                </div>
              )}
            </>
          )}
        </Section>
      </Container>
    </>
  );
};

export default ArtistStreamsPage;
