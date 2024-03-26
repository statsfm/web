import type { GetServerSideProps, NextPage } from 'next';
import { useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { SpotifyIcon } from '@/components/Icons';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const Login: NextPage = () => {
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

  return (
    <Container className="flex min-h-[90vh] pt-24">
      <div className="mx-auto mt-48 flex w-96 flex-col px-4">
        <h1 className="w-full text-center text-4xl text-white">
          Login to stats.fm
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Button
            onClick={() => {
              router.push('/api/auth/spotify');
            }}
            className="w-full bg-primary/80 !text-black hover:bg-primary/60 active:bg-primary/50"
          >
            <SpotifyIcon className="mr-2 !fill-black" />
            Continue with Spotify
          </Button>
        </div>
        {/* <div className="mt-8 flex flex-col gap-4">
          <Button
            onClick={() => {
              router.push('/api/auth/apple');
            }}
            className="w-full bg-applemusic/80 text-white hover:!bg-applemusic/60 active:!bg-applemusic/50"
          >
            <AppleMusicIcon className="mr-2 !fill-white" hover={false} />
            Continue with Apple
          </Button>
        </div> */}
      </div>
    </Container>
  );
};

export default Login;
