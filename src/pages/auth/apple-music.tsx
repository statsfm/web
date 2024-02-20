import type { NextPage } from 'next';
import { useApi, useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { useRouter } from 'next/router';
import type { SSRProps } from '@/utils/ssrUtils';
import Script from 'next/script';

const Login: NextPage<SSRProps> = () => {
  const router = useRouter();
  const toaster = useToaster();
  const api = useApi();
  // const [musicKitLoaded, setMusicKitLoaded] = useState(false);
  let inProgress = false;

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
    inProgress = true;

    try {
      const music = MusicKit.getInstance();
      const MUT = await music.authorize();

      // // eslint-disable-next-line no-promise-executor-return
      // await new Promise((resolve) => setTimeout(resolve, 500));

      window.location.replace(
        api.http.resolveUrl(
          '/auth/APPLEMUSIC/callback/music',
          true,
          `mut=${encodeURIComponent(MUT)}&state=${state}`
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
          name: process.env.NEXT_PUBLIC_APPLE_APP_NAME ?? 'stats.fm',
          build: process.env.NEXT_PUBLIC_APPLE_APP_BUILD ?? '1978.4.1',
        },
      });
      await appleMusicKitHandle();
    })();
  };

  // useEffect(() => {
  //   initializeMusicKit();
  // }, [router.isReady, musicKitLoaded, router.query]);

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
            An Apple Music popup should appear soon...
            {/* <Button
              onClick={appleMusicKitHandle}
              className="w-full bg-applemusic/80 text-white hover:bg-applemusic/60 active:bg-applemusic/50"
            >
              <AppleMusicIcon className="mr-2 !fill-white" hover={false} />
              Authorize
            </Button> */}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
