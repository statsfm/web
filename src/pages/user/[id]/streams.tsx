import { Container } from '@/components/Container';
import type { SSRProps } from '@/utils/ssrUtils';
import { getApiInstance, fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { MdChevronLeft, MdDiscFull, MdVisibilityOff } from 'react-icons/md';
import type * as statsfm from '@/utils/statsfm';
import { Title } from '@/components/Title';
import { Section } from '@/components/Section/Section';
import { useApi } from '@/hooks';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Spinner } from '@/components/Spinner';
import { RecentStreams } from '@/components/RecentStreams';
import clsx from 'clsx';
import { useRouter } from 'next/router';

const usePrivacyScope = (
  scope: keyof statsfm.UserPrivacySettings,
  user: statsfm.UserPublic,
) => {
  return user.privacySettings && user.privacySettings[scope];
};

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
  userProfile: statsfm.UserPublic;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { identityToken } = ctx.req.cookies;
  const api = getApiInstance(identityToken);
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  const userProfile = await api.users.get(id).catch(() => {});
  if (!userProfile) return { notFound: true };
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
      userProfile,
    },
  };
};

const StreamsPage: NextPage<Props> = ({ userProfile }) => {
  const api = useApi();
  const scopePrivate = usePrivacyScope('streams', userProfile);
  const router = useRouter();

  const [recentStreams, setRecentStreams] = useState<statsfm.Stream[]>([]);
  const [loadMore, setLoadMore] = useState(true);

  const callbackRef = async () => {
    if (!userProfile.privacySettings?.recentlyPlayed) return;
    const lastEndTime = recentStreams[recentStreams.length - 1]
      ?.endTime as any as string;

    const streams = await api.users.streams(userProfile.id, {
      limit: 200,
      before: new Date(lastEndTime).getTime() || new Date().getTime(),
    });

    if (streams.length === 0) setLoadMore(false);
    setRecentStreams([...(recentStreams || []), ...streams.slice(1)]);
  };

  return (
    <>
      <Title>{`${userProfile.displayName}'s streams`}</Title>
      <div className="relative z-[31] bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row md:items-start">
            <div className="flex w-full flex-col justify-end">
              <Link
                legacyBehavior
                href={`/${userProfile.customId || userProfile.id}`}
              >
                <a className="-mb-3 flex items-center text-lg text-white">
                  <MdChevronLeft className="-mr-1 block h-12 w-6 text-white" />
                  back to {userProfile.displayName}
                </a>
              </Link>
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-left">
                {userProfile.displayName}
                {/* TODO: pluralisation */}
                <span className="text-white">&apos;s streaming history</span>
              </h1>
            </div>
          </section>
        </Container>
      </div>
      <Container>
        {scopePrivate ? (
          <Section
            headerStyle="!flex-row-reverse -mt-24 z-30 relative"
            title={`back to ${userProfile.displayName}`}
            toolbar={
              <Toolbar
                closeCallback={() =>
                  router.push(`/${userProfile.customId || userProfile.id}`)
                }
              />
            }
          >
            {/* TODO: add title on here */}
            {({ headerRef }) => (
              <>
                <InfiniteScroll
                  loadMore={callbackRef}
                  hasMore={loadMore}
                  loader={
                    <Spinner
                      key="bigtimerush"
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
        ) : (
          <div className="grid w-full place-items-center py-20">
            <MdVisibilityOff />

            <p className="m-0 text-text-grey">
              {userProfile.displayName} doesn&apos;t share this
            </p>
          </div>
        )}
      </Container>
    </>
  );
};

export default StreamsPage;
