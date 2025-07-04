import Head from 'next/head';
import { useEffect, useMemo } from 'react';

import { Title } from '@/components/Title';
import useAnalytics from '@/hooks/use-analytics';
import { getApiInstance } from '@/utils/ssrUtils';
import { useStoreURL } from '@/hooks/use-store-url';
import { useAnimation } from '@/hooks/use-animations';
import { ANALYTICS_EVENTS } from '@/constants/analytics';

import type { GetServerSideProps, NextPage } from 'next';
import type * as statsfm from '@/utils/statsfm';

type AnalyticsParams = {
  platform: string | null;
  referrer_id: string | null;
  device_type: string | null;
  referral_source: string | null;
};

type Props = {
  analyticsParams: AnalyticsParams;
  inviter: statsfm.UserPublic | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const { device, platform, referral_source, referrer_id } = ctx.query;

  if (typeof referrer_id !== 'string') {
    return {
      notFound: true,
    };
  }

  const analyticsParams: AnalyticsParams = {
    referrer_id,
    device_type: typeof device === 'string' ? device : null,
    platform: typeof platform === 'string' ? platform : null,
    referral_source:
      typeof referral_source === 'string' ? referral_source : null,
  };

  try {
    const inviter = await api.users.get(referrer_id);
    return {
      props: {
        inviter,
        analyticsParams,
      },
    };
  } catch (error) {
    return {
      props: {
        inviter: null,
        analyticsParams,
      },
    };
  }
};

const ReferralPage: NextPage<Props> = ({ inviter, analyticsParams }) => {
  const { rudder } = useAnalytics();
  const { goToStore } = useStoreURL();

  const handleStoreRedirect = () => {
    rudder?.track(ANALYTICS_EVENTS.REFERRAL.CTA_CLICKED, analyticsParams);
    goToStore();
  };

  useEffect(() => {
    rudder?.track(ANALYTICS_EVENTS.REFERRAL.PAGE_VIEWD, analyticsParams);
  }, [rudder]);

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

  const ogImage = useMemo(() => inviter?.referralImage ?? undefined, [inviter]);
  const ogReferralURL = useMemo(
    () => inviter?.referralURL ?? undefined,
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
        <meta property="og:title" content="Tap to see my music stats" />
        <meta
          property="og:description"
          content={
            inviter
              ? `See what ${inviter.displayName} is playing too. Music hits harder together`
              : 'Join the stats.fm community'
          }
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogReferralURL} />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <div className="fixed inset-0 z-0">
        <ProfileAnimation />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 py-8 text-white">
        <div className="h-[55%] sm:h-[30%]" />

        <div className="w-full max-w-md text-center">
          <div className="mb-4">
            <div className="w-full overflow-hidden">
              <span className="inline-block max-w-full truncate rounded-full bg-white/15 px-4 py-2 text-[20px] font-normal text-white">
                {username}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <h1 className="mb-4 text-[40px] font-bold leading-tight md:text-4xl">
              Guess what they
              <br />
              are listening to 👀
            </h1>
            <p className="font-normal leading-6 text-gray-400">
              Accept the invite to find out
            </p>
          </div>

          <button
            onClick={handleStoreRedirect}
            className="mx-auto mt-4 w-full min-w-[240px] max-w-xs rounded-xl bg-[#1DB954] px-6 py-3 text-base font-medium text-black transition-colors hover:bg-primary"
          >
            Accept invite
          </button>
        </div>
      </div>
    </>
  );
};

export default ReferralPage;
