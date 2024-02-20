import type { NextPage } from 'next';
import { useApi, useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { useRouter } from 'next/router';
import type { SSRProps } from '@/utils/ssrUtils';
import { Button } from '@/components/Button';
import { AppleMusicIcon } from '@/components/Icons';
import Script from 'next/script';

const Login: NextPage<SSRProps> = () => {
  const router = useRouter();
  const toaster = useToaster();
  const api = useApi();
  let inProgress = false;

  const redirectToLogin = () => {
    toaster.error('Sign in with Apple first');
    router.push('/login');
  };

  const appleMusicKitHandle = async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { state } = router.query;
    if (!state) {
      redirectToLogin();
      return;
    }

    if (inProgress) return;
    inProgress = true;

    try {
      const music = MusicKit.getInstance();
      const MUT = await music.authorize();

      router.push(
        api.http.resolveUrl(
          '/auth/APPLEMUSIC/redirect',
          true,
          `?mut=${MUT}&state=${state}`
        )
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toaster.error('Something went wrong trying to login. Please try again.');
    }
    inProgress = false;
  };

  const initializeMusicKit = () => {
    (async () => {
      const data = await api.http.get<{ item: string }>(
        '/auth/APPLEMUSIC/developerToken'
      );
      const developerToken = data.item;
      await MusicKit.configure({
        developerToken,
        app: {
          name: process.env.NEXT_PUBLIC_APPLE_APP_NAME ?? 'testing',
          build: process.env.NEXT_PUBLIC_APPLE_APP_BUILD ?? '1978.4.1',
        },
      });
      await appleMusicKitHandle();
    })();
  };

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
            Login to Apple Music
          </h1>
          <div className="mt-8 flex flex-col gap-4">
            <Button
              onClick={appleMusicKitHandle}
              className="w-full bg-applemusic/80 text-white hover:bg-applemusic/60 active:bg-applemusic/50"
            >
              <AppleMusicIcon className="mr-2 !fill-white" hover={false} />
              Continue with Apple Music
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
