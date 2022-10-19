import { Container } from '@/components/Container';
import type { SSRProps } from '@/utils/ssrUtils';
import { getApiInstance, fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { MdChevronLeft, MdVisibilityOff } from 'react-icons/md';
import type * as statsfm from '@statsfm/statsfm.js';
import { Title } from '@/components/Title';
import { RecentStreams } from '@/components/RecentStreams';
import { Section } from '@/components/Section';
import { useApi, useAuth } from '@/hooks';
import type { PropsWithChildren } from 'react';
import { useRef, useEffect, useState, createContext, useContext } from 'react';
import { useWindowScroll } from 'react-use';

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
  const { user } = useAuth();
  const api = useApi();
  const { y: offsetY } = useWindowScroll();
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const callbackRef = useRef<any>();

  const [recentStreams, setRecentStreams] = useState<statsfm.Stream[]>([]);

  callbackRef.current = async () => {
    console.log('halloo', loading);
    if (!userProfile.privacySettings?.recentlyPlayed) return;
    if (loading) return;
    setLoading(true);
    console.log('bruh');
    console.log(recentStreams.length);
    const huts = recentStreams[recentStreams.length - 1]
      ?.endTime as any as string;
    console.log(huts);

    const streams = await api.users.streams(userProfile.id, {
      limit: 50,
      before: new Date(huts).getTime() || new Date().getTime(),
    });

    setRecentStreams([...(recentStreams || []), ...streams]);
    setLoading(false);
  };

  useEffect(() => {
    console.log(loading);
    if (!contentRef.current) return;
    const { clientHeight } = document.documentElement;
    const { clientHeight: refH } = contentRef.current;

    if (offsetY + clientHeight >= refH && !loading) {
      callbackRef.current();
    }
  }, [offsetY]);

  useEffect(() => {
    callbackRef.current();
  }, []);

  if (!user) return null;
  // const isCurrentUser = userProfile?.id === user.id;

  return (
    <>
      <Title>{`${userProfile.displayName}'s streams`}</Title>
      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row md:items-start">
            <div className="flex w-full flex-col justify-end">
              <Link href={`/${userProfile.customId || userProfile.id}`}>
                <a className="-mb-3 flex items-center text-lg text-white">
                  <MdChevronLeft className="-mr-1 block h-12 w-6 text-white" />
                  back to {userProfile.displayName}
                </a>
              </Link>
              <h1 className="text-4xl font-extrabold capitalize sm:text-5xl md:text-left">
                {userProfile.displayName}
                <span className="text-white">&apos;s Streaming History</span>
              </h1>
            </div>
          </section>
        </Container>
      </div>
      <Container ref={contentRef}>
        <UserContext.Provider value={userProfile}>
          <Section headerStyle="!py-0">
            {({ headerRef }) => (
              <PrivacyScope scope="recentlyPlayed">
                <RecentStreams headerRef={headerRef} streams={recentStreams} />
              </PrivacyScope>
            )}
          </Section>
        </UserContext.Provider>
      </Container>
    </>
  );
};

export default StreamsPage;
