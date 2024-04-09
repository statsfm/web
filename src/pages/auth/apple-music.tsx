'use client';

import type { NextPage } from 'next';
import { useApi, useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { useRouter } from 'next/router';
import type { SSRProps } from '@/utils/ssrUtils';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { AppleMusicIcon } from '@/components/Icons';
import { Button } from '@/components/Button';

const Login: NextPage<SSRProps> = () => {
  const router = useRouter();
  const toaster = useToaster();
  const api = useApi();
  // const [musicKitLoaded, setMusicKitLoaded] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const redirectToLogin = () => {
    toaster.error('Sign in with Apple first');
    router.push('/login');
  };

  const appleMusicKitHandle = async () => {
    // for some reason, the query from router is always empty
    // const { state } = router.query;

    const query = new URLSearchParams(window.location.search);
    const state = query.get('state');

    if (!state) {
      redirectToLogin();
      return;
    }

    if (inProgress) return;
    setInProgress(true);

    try {
      const music = MusicKit.getInstance();
      const MUT = await music.authorize();

      window.location.replace(
        api.http.resolveUrl(
          '/auth/APPLEMUSIC/callback/music',
          true,
          `mut=${encodeURIComponent(MUT)}&state=${state}`,
        ),
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toaster.error('Something went wrong trying to login. Please try again.');
    } finally {
      setInProgress(false);
    }
  };

  const initializeMusicKit = () => {
    (async () => {
      const data = await api.http.get<{ item: string }>(
        '/auth/APPLEMUSIC/developerToken',
      );
      const developerToken = data.item;
      await MusicKit.configure({
        developerToken,
        app: {
          name: process.env.NEXT_PUBLIC_APPLE_APP_NAME ?? 'stats.fm',
          build: process.env.NEXT_PUBLIC_APPLE_APP_BUILD ?? '1978.4.1',
        },
      });
      await appleMusicKitHandle();
    })();
  };

  useEffect(() => {
    // 3 second timeout to show the button
    const timeout = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Script
        src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
        async
        onReady={initializeMusicKit}
      />
      <Container className="flex min-h-[90vh] pt-24">
        <div className="mx-auto mt-48 flex w-96 flex-col px-4">
          <h1 className="w-full text-center text-4xl text-white">
            Authorize Apple Music
          </h1>
          <div className="mt-8 flex flex-col gap-4">
            <p className="text-center">
              An Apple Music popup should appear soon... If it doesn&apos;t,
              please check if you have browser popups blocked.
            </p>
            {showButton && (
              <Button
                onClick={appleMusicKitHandle}
                className="w-full bg-applemusic/80 text-white hover:bg-applemusic/60 active:bg-applemusic/50"
              >
                <AppleMusicIcon className="mr-2 !fill-white" hover={false} />
                Authorize
              </Button>
            )}{' '}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
