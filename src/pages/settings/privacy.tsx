import { AccountLayout } from '@/components/account/Layout';
import { SettingsHeader } from '@/components/account/SettingsHeader';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import { Overlay } from '@/components/Overlay';
import { useApi, useAuth } from '@/hooks';
import { Switch } from '@headlessui/react';
import type { UserPrivacySettings, UserPrivate } from '@statsfm/statsfm.js';
import clsx from 'clsx';
import type { NextPage } from 'next';
import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';

type StatusOptions = 'SAVING' | 'SAVED' | 'ERROR' | 'DEFAULT';

const PrivacyList: FC<{ user: UserPrivate }> = ({ user }) => {
  const { updateUser } = useAuth();
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
      updateUser({ ...user, privacySettings });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      setStatus('ERROR');
    }

    setStatus('SAVED');
  }, [privacySettings]);

  return (
    <div className="relative w-full">
      <Overlay visible={status === 'SAVING'}>saving...</Overlay>
      <SettingsHeader title="Privacy">
        <Button
          onClick={save}
          disabled={!changed || status === 'SAVING'}
          className={clsx(
            changed ? 'hover:bg-primary/60 active:bg-primary/40' : '',
            ' block h-min rounded-md bg-primary py-2 px-4 text-background'
          )}
        >
          Save
        </Button>
      </SettingsHeader>

      <ul>
        {privacySettings &&
          Object.entries<boolean>(
            privacySettings as unknown as { [s: string]: boolean }
          ).map(([setting, value], i) => (
            <li key={i}>
              <Divider />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl">placeholder {setting}</h3>
                  <p className="m-0 font-normal">placeholder description</p>
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

const PrivacyPage: NextPage = () => {
  const { user } = useAuth();
  if (!user) return <Container>Unauthorized</Container>;

  return (
    <AccountLayout>
      <PrivacyList user={user} />
    </AccountLayout>
  );
};

export default PrivacyPage;
