import type { GetServerSideProps, NextPage } from 'next';
import { useAuth, useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { AppleMusicIcon, SpotifyIcon } from '@/components/Icons';
import type { MouseEventHandler } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import { LoginAppleMusicButton } from '@/components/Login/LoginAppleMusicButton';

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

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

  const generateQueryString = (q: Record<string, any>): string => {
    return Object.entries(q)
      .filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value.toString().trim() !== ''
      )
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  };

  const appleAuthHandle: MouseEventHandler<HTMLButtonElement> = () => {
    window.location.href = `https://appleid.apple.com/auth/authorize?${generateQueryString(
      {
        response_type: 'code',
        response_mode: 'form_post',
        client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI
          ? `${process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI}/web`
          : '',
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
              router.push('/api/auth/spotify-login');
            }}
            className="w-full bg-primary/80 text-black hover:bg-primary/60 active:bg-primary/50"
          >
            <SpotifyIcon className="mr-2 !fill-black" />
            Continue with Spotify
          </Button>
        </div>
        {auth?.user?.appleMusicAuth ? (
          <LoginAppleMusicButton />
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            <Button
              onClick={appleAuthHandle}
              className="w-full bg-applemusic/80 text-white hover:!bg-applemusic/60 active:!bg-applemusic/50"
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
