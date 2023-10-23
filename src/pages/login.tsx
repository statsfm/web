import type { NextPage } from 'next';
import { useAuth, useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { AppleMusicIcon, SpotifyIcon } from '@/components/Icons';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LoginAppleMusicButton } from '@/components/Login/LoginAppleMusicButton';

const Login: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const toaster = useToaster();

  useEffect(() => {
    const { redirect, failed } = router.query;
    if (failed) {
      toaster.error('Something went wrong trying to login. Please try again.');
    }

    if (!redirect) return;
    Cookies.set('redirectUrl', redirect.toString());
  }, [router]);

  const generateQueryString = (q: any) => {
    let queryString = '';
    if (q) {
      const queryKeys = Object.keys(q);
      queryKeys.forEach((key) => {
        if (q[key]) {
          if (q[key].toString().length) {
            queryString += `${key}=${q[key]}&`;
          }
        }
      });
      if (queryKeys.length > 0 && queryString[queryString.length - 1] === '&') {
        queryString = queryString.slice(0, -1);
      }
    }
    return queryString;
  };

  const appleAuthHandle = async (e: any = null) => {
    if (e) {
      e.preventDefault();
    }
    window.location.href = `https://appleid.apple.com/auth/authorize?${generateQueryString(
      {
        response_type: 'code',
        response_mode: 'query',
        client_id: process.env.APPLE_CLIENT_ID,
        redirect_uri: encodeURIComponent(process.env.APPLE_REDIRECT_URI || ''),
        scope: 'email name',
      }
    )}`;
  };
  return (
    <Container className="flex min-h-[90vh] pt-24">
      <div className="mx-auto mt-48 flex w-96 flex-col px-4">
        <h1 className="w-full text-center text-4xl text-white">
          Login to stats.fm
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Button
            onClick={() => {
              auth.login();
            }}
            className="w-full bg-primary/80 text-black hover:bg-primary/60 active:bg-primary/50"
          >
            <SpotifyIcon className="mr-2 !fill-black" />
            Continue with Spotify
          </Button>
        </div>
        {auth &&
        auth.user &&
        auth.user.id &&
        auth.user?.connectedServices?.apple?.connected ? (
          <LoginAppleMusicButton userId={auth.user.id} redirect={false} />
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            <Button
              onClick={appleAuthHandle}
              className="w-full bg-applemusic/80 text-white hover:bg-applemusic/60 active:bg-applemusic/50"
            >
              <AppleMusicIcon className="mr-2 !fill-white" hover={false} />
              Continue with Apple
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Login;
