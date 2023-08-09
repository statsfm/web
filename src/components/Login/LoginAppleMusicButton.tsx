import Script from 'next/script';
import { Button } from '@/components/Button';
import { AppleMusicIcon } from '@/components/Icons';
import { useToaster } from '@/hooks';

interface Props {
  userId: string;
  redirect: boolean;
}

export const LoginAppleMusicButton = ({ userId, redirect }: Props) => {
  const toaster = useToaster();
  const appleMusicKitHandle = async () => {
    if (userId) {
      // @ts-ignore
      const music = MusicKit.getInstance();
      const MUT = await music.authorize();
      const added = await fetch(
        `https://apple-music-beta-api.stats.fm/api/v1/auth/appleMusic/add-mut?userId=${userId}&mut=${MUT}`
      );
      if (added)
        window.location.href = `https://apple-music-beta.stats.fm/${userId}`;
      else toaster.error('You not logged in Apple Music');
    } else {
      toaster.error('You not logged in Apple');
    }
  };
  let initialized = false;

  const initializeMusicKit = async () => {
    // @ts-ignore
    await MusicKit.configure({
      developerToken: process.env.APPLE_DEVELOPER_TOKEN,
      app: {
        name: process.env.APPLE_APP_NAME || 'testing',
        build: process.env.APPLE_APP_BUILD || '1978.4.1',
      },
    });
    initialized = true;
  };

  if (redirect && userId && initialized) {
    appleMusicKitHandle();
  }
  return (
    <>
      <Script
        src="https://js-cdn.music.apple.com/musickit/v3/musickit.js"
        async
        onLoad={initializeMusicKit}
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
