import { AccountLayout } from '@/components/settings/Layout';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Overlay } from '@/components/Overlay';
import { useApi, useAuth } from '@/hooks';
import { Switch } from '@headlessui/react';
import type { UserPrivacySettings, UserPrivate } from '@statsfm/statsfm.js';
import clsx from 'clsx';
import type { GetServerSideProps, NextPage } from 'next';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import { event } from 'nextjs-google-analytics';

type DisplayNamesType = {
  [key in keyof UserPrivacySettings | 'leaderboards' | 'connections']: {
    title: string;
    description: string;
  };
};

const displayNames: DisplayNamesType = {
  profile: {
    title: 'Public Profile',
    description:
      'Whether or not your profile is visible to other users. If you disable this, your profile wont be accessible to others.',
  },
  currentlyPlaying: {
    title: 'Currently Playing',
    description: "The track you're currently playing.",
  },
  recentlyPlayed: {
    title: 'Recently played',
    description: 'Your 50 last played tracks.',
  },
  topTracks: {
    title: 'Top tracks',
    description: 'Your top tracks.',
  },
  topArtists: {
    title: 'Top artists',
    description: 'Your top artists',
  },
  topAlbums: {
    title: 'Top albums',
    description: 'Your top albums.',
  },
  topGenres: {
    title: 'Top genres',
    description: 'Your top genres.',
  },
  streams: {
    title: 'Streams',
    description:
      'Your individual streams (all or filtered by artist, track or album).',
  },
  streamStats: {
    title: 'Stream stats',
    description:
      'Statistics such as number of streams, minutes streamed and charts using that data.',
  },
  friends: {
    title: 'Friends',
    description: 'Your friends.',
  },
  leaderboards: {
    title: 'Leaderboards',
    description:
      'Show your profile in global leaderboards (for example top listeners of a specific artist)',
  },
  connections: {
    title: 'Connections',
    description: 'Your connections to other services.',
  },
};

type StatusOptions = 'SAVING' | 'SAVED' | 'ERROR' | 'DEFAULT';

const PrivacyList: FC<{ user: UserPrivate }> = () => {
  const auth = useAuth();
  const user = auth.user!;
  const api = useApi();
  const [status, setStatus] = useState<StatusOptions>('DEFAULT');

  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>(
    user.privacySettings!
  );

  const changed = useMemo(() => {
    return (
      JSON.stringify(privacySettings) !== JSON.stringify(user.privacySettings)
    );
  }, [privacySettings, user]);

  const save = useCallback(async () => {
    setStatus('SAVING');
    try {
      await api.me.updatePrivacySettings({ ...privacySettings });
      auth.updateUser({ ...user, privacySettings });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      setStatus('ERROR');
    }

    setStatus('SAVED');
    event('SETTINGS_profile_saved');
  }, [privacySettings]);

  const displaySettings = useMemo(() => {
    const entries = Object.entries<boolean>(
      privacySettings as unknown as {
        [key in keyof UserPrivacySettings]: boolean;
      }
    ) as [keyof UserPrivacySettings, boolean][];

    const displayKeys = Object.keys(displayNames);
    return entries.filter(([key]) => displayKeys.includes(key));
  }, [privacySettings]);

  return (
    <div className="relative w-full">
      <Overlay visible={status === 'SAVING'}>saving...</Overlay>
      <SettingsHeader title="Privacy">
        <Button
          onClick={save}
          disabled={!changed || status === 'SAVING'}
          className={clsx(
            changed ? 'hover:!bg-primary/60 active:!bg-primary/40' : '',
            ' block h-min rounded-md !bg-primary py-2 px-4 text-background'
          )}
        >
          Save
        </Button>
      </SettingsHeader>

      <ul>
        {privacySettings &&
          displaySettings.map(([setting, value]) => (
            <li key={setting}>
              <Divider />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg">{displayNames[setting].title}</h3>
                  <p className="m-0 text-sm font-medium">
                    {displayNames[setting].description}
                  </p>
                </div>

                <Switch
                  checked={value}
                  onChange={(value) =>
                    setPrivacySettings({
                      ...privacySettings,
                      [setting]: value,
                    })
                  }
                  className={clsx(
                    value ? 'bg-primary' : 'bg-primaryLighter',
                    'relative flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent py-3 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'
                  )}
                >
                  <span
                    className={clsx(
                      value ? 'translate-x-5' : 'translate-x-[2px]',
                      'h-[22px] w-[22px] rounded-full bg-white transition-transform duration-200 ease-in-out'
                    )}
                  />
                </Switch>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const PrivacyPage: NextPage = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <AccountLayout>
      <PrivacyList user={user} />
    </AccountLayout>
  );
};

export default PrivacyPage;
