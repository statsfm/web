import Head from 'next/head';
import { useMemo } from 'react';

import { Title } from '@/components/Title';
import { getApiInstance } from '@/utils/ssrUtils';
import { useStoreURL } from '@/hooks/use-store-url';
import { useAnimation } from '@/hooks/use-animations';

import type { GetServerSideProps, NextPage } from 'next';
import type * as statsfm from '@/utils/statsfm';

type Props = {
  origin: string;
  inviter: statsfm.UserPublic | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const { referrerId } = ctx.params!;

  if (typeof referrerId !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const inviter = await api.users.get(referrerId);
    return {
      props: {
        inviter,
        origin: `https://${ctx.req.headers.host}`,
      },
    };
  } catch (error) {
    return {
      props: {
        inviter: null,
        origin: `https://${ctx.req.headers.host}`,
      },
    };
  }
};

const ReferralPage: NextPage<Props> = ({ inviter, origin }) => {
  const { goToStore } = useStoreURL();

  const username = useMemo(
    () =>
      inviter
        ? `@${(inviter.customId ?? inviter.displayName).toLowerCase().replace(/\s/g, '')}`
        : '@statsfm',
    [inviter],
  );

  const title = useMemo(
    () =>
      inviter ? `Join ${inviter.displayName} on stats.fm` : 'Join stats.fm',
    [inviter],
  );

  const ProfileAnimation = useAnimation({
    animation: 'headphone.riv',
    assetLoaders: {
      photo: {
        targetWidth: 256,
        targetHeight: 256,
        url: inviter?.image,
      },
    },
  });

  return (
    <>
      <Title>{title}</Title>
      <Head>
        <meta
          property="og:description"
          content={
            inviter
              ? `${inviter.displayName} invited you to join stats.fm`
              : 'Join the stats.fm community'
          }
        />
        <meta property="og:image" content={`${origin}/api/og/invite`} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <div className="fixed inset-0 z-0">
        <ProfileAnimation />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 py-8 text-white">
        <div className="h-[55%] sm:h-[30%]" />

        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-full overflow-hidden">
              <span className="inline-block max-w-full px-4 py-2 bg-white/15 text-white rounded-full text-sm truncate">
                {username}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Guess what they
              <br />
              are listening to 👀
            </h1>
            <p className="text-gray-400 font-normal leading-6">
              Accept the invite to find out
            </p>
          </div>

          <button
            onClick={goToStore}
            className="w-full max-w-xs mx-auto mt-8 px-6 py-3 bg-[#1DB954] text-black font-medium rounded-xl hover:bg-[#1ed760] transition-colors text-base"
          >
            Accept invite
          </button>
        </div>
      </div>
    </>
  );
};

export default ReferralPage;
