import Script from 'next/script';
import { Button } from '@/components/Button';
import { AppleMusicIcon } from '@/components/Icons';
import { useApi, useAuth, useToaster } from '@/hooks';
import { useRouter } from 'next/router';

export const LoginAppleMusicButton = () => {
  const api = useApi();
  const auth = useAuth();
  const toaster = useToaster();
  const router = useRouter();

  const redirectToLogin = () => {
    toaster.error("You're not logged in with Apple");
    router.push('/login');
  };

  const appleMusicKitHandle = async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { id_token } = router.query;
    if (!id_token) {
      redirectToLogin();
      return;
    }

    // @ts-ignore
    const music = MusicKit.getInstance();
    const MUT = await music.authorize();
    // eslint-disable-next-line no-console
    console.log(await music.api.album(1025210938));
    // eslint-disable-next-line no-alert
    alert('please dismiss this test popup');
    const meData = await api.http.put('/auth/appleMusic', {
      body: JSON.stringify({
        userToken: MUT,
        idToken: id_token,
      }),
      authRequired: true,
    });
    // eslint-disable-next-line no-alert
    alert(`token sent 👍\n${JSON.stringify(meData, null, 2)}`);

    // if (added) {
    router.push(`/${auth.user?.id}`);
    // } else {
    //   redirectToLogin();
    // }
  };

  const initializeMusicKit = () => {
    (async () => {
      // @ts-ignore
      await MusicKit.configure({
        developerToken: process.env.APPLE_DEVELOPER_TOKEN,
        app: {
          name: process.env.APPLE_APP_NAME || 'testing',
          build: process.env.APPLE_APP_BUILD || '1978.4.1',
        },
      });
    })();
  };

  return (
    <>
      <Script
        src="https://js-cdn.music.apple.com/musickit/v1/musickit.js"
        async
        onReady={initializeMusicKit}
      />
      <div className="mt-8 flex flex-col gap-4">
        <Button
          onClick={appleMusicKitHandle}
          className="w-full bg-applemusic/80 text-white hover:bg-applemusic/60 active:bg-applemusic/50"
        >
          <AppleMusicIcon className="mr-2 !fill-white" hover={false} />
          Continue with Apple Music
        </Button>
      </div>
    </>
  );
};
