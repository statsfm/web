import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/Input';
import { Menu } from '@/components/Menu';
import { Section } from '@/components/Section';
import { Textarea } from '@/components/Textarea';
import { useApi, useAuth } from '@/hooks';
import { Switch } from '@headlessui/react';
import type { UserPrivacySettings, UserPrivate } from '@statsfm/statsfm.js';
import clsx from 'clsx';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { Dispatch, FC, PropsWithChildren } from 'react';
import {
  useCallback,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { MdArrowDropDown, MdCameraEnhance } from 'react-icons/md';

type Pronoun = { aliases: string[]; description: string };

interface Props {
  pronouns: Pronoun[];
}

const SideNavItem: FC<PropsWithChildren<{ href: string }>> = (props) => {
  const { pathname } = useRouter();

  return (
    <Link href={props.href}>
      <a
        className={clsx(
          pathname === props.href
            ? 'bg-bodySecundary text-primary'
            : 'bg-transparent text-white',
          '-ml-4 block rounded-lg px-4 py-2 font-bold  hover:bg-bodySecundary hover:opacity-90 focus:bg-bodySecundary'
        )}
      >
        {props.children}
      </a>
    </Link>
  );
};

const SideNav: FC = () => {
  return (
    <aside className="flex flex-col gap-1">
      <SideNavItem href="/account">Account & Privacy</SideNavItem>
      <SideNavItem href="/account/connections">Connections</SideNavItem>
      <SideNavItem href="/account/privacy">Privacy & Data</SideNavItem>
    </aside>
  );
};

type StatusOptions = 'SAVING' | 'SAVED' | 'ERROR' | 'DEFAULT';

type StateContextType = {
  avatarFiles: [FileList | null, Dispatch<FileList | null>];
  displayName: [string, Dispatch<string>];
  customId: [string, Dispatch<string>];
  bio: [string, Dispatch<string>];
  privacySettings: [UserPrivacySettings, Dispatch<UserPrivacySettings>];
  pronouns: [string | null, Dispatch<string | null>];
  status: [StatusOptions, Dispatch<StatusOptions>];
  changed: boolean;
  save: () => Promise<boolean>;
};

const stateContext = createContext<StateContextType | null>(null);

const StateContextProvider: FC<PropsWithChildren<{ user: UserPrivate }>> = ({
  user,
  children,
}) => {
  const api = useApi();
  const { updateUser } = useAuth();

  const [files, setFiles] = useState<FileList | null>(null);
  const [displayName, setDisplayName] = useState<string>(user.displayName);
  const [customId, setCustomId] = useState<string>(user.customId);
  const [bio, setBio] = useState<string>(user.profile?.bio ?? '');
  const [privacySettings, setPrivacySettings] = useState<UserPrivacySettings>(
    user.privacySettings!
  );
  const [pronouns, setPronouns] = useState<string | null>(
    user.profile?.pronouns ?? null
  );

  const [status, setStatus] = useState<StatusOptions>('DEFAULT');

  const changed = useMemo(
    () =>
      (files?.length ?? 0) > 0 ||
      displayName !== user.displayName ||
      customId !== user.customId ||
      bio !== user.profile?.bio ||
      privacySettings !== user.privacySettings ||
      pronouns !== user.profile?.pronouns,
    [files, displayName, customId, bio, privacySettings, pronouns, user]
  );

  const uploadAvatar = useCallback(async () => {
    if (files && files.length > 0 && files[0]) {
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await api.http.post('/me/image', {
        body: formData,
        headers: { 'Content-Type': null! },
      });

      const { image } = res.data as unknown as { image: string };

      setFiles(null);
      return image;
    }

    return null;
  }, [files]);

  const save = async () => {
    setStatus('SAVING');
    try {
      await api.me.updateProfile({ bio, pronouns: pronouns || undefined });
      await api.me.updatePrivacySettings({ ...privacySettings });
      await api.me.updateMe({
        ...user,
        displayName,
        customId,
      });

      const url = await uploadAvatar();

      updateUser({
        ...user,
        displayName,
        customId,
        image: url ?? user.image,
        profile: { bio, pronouns: pronouns || undefined },
      });
    } catch (e) {
      setStatus('ERROR');
      // eslint-disable-next-line no-console
      console.warn(e);
      return false;
    }

    setStatus('SAVED');
    return true;
  };

  return (
    <stateContext.Provider
      value={{
        avatarFiles: [files, setFiles],
        displayName: [displayName, setDisplayName],
        customId: [customId, setCustomId],
        bio: [bio, setBio],
        privacySettings: [privacySettings, setPrivacySettings],
        pronouns: [pronouns, setPronouns],
        status: [status, setStatus],
        changed,
        save,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

const AvatarInput: FC<{ defaultSrc: string }> = ({ defaultSrc }) => {
  const {
    displayName: [displayName],
    avatarFiles: [files, setFiles],
  } = useContext(stateContext)!;

  const [hovering, setHovering] = useState(false);
  const previewUrl = useMemo(() => {
    if (files && files.length > 0 && files[0]) {
      return URL.createObjectURL(files[0]);
    }
    return null;
  }, [files]);

  return (
    <>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={(e) => setFiles(e.target.files)}
      />
      <label
        htmlFor="fileInput"
        className="relative h-min cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Avatar
          src={previewUrl || defaultSrc}
          name={displayName || ''}
          size="3xl"
        />

        <div
          className={clsx(
            hovering ? 'opacity-40' : 'opacity-0',
            'absolute top-0 h-full w-full rounded-full bg-black transition-opacity'
          )}
        />
        <div className="absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-bodySecundary">
          <MdCameraEnhance
            size="22px"
            className={clsx(
              hovering ? 'text-primary' : '',
              'transition-colors'
            )}
          />
        </div>
      </label>
    </>
  );
};

const AccountPrivacyInfoForm: FC<{
  pronouns: Pronoun[];
  user: UserPrivate;
}> = ({ pronouns, user }) => {
  const {
    displayName: [displayName, setDisplayName],
    customId: [customId, setCustomId],
    bio: [bio, setBio],
    pronouns: [pronoun, setPronoun],
    privacySettings: [privacySettings, setPrivacySettings],
    status: [status],
    changed,
    save,
  } = useContext(stateContext)!;

  return (
    <main className="relative w-full">
      <div
        className={clsx(
          status === 'SAVING' ? 'opacity-100' : 'pointer-events-none opacity-0',
          'absolute top-0 z-30 h-full w-full bg-background/60 transition-opacity'
        )}
      >
        <div className="sticky top-0 flex h-screen w-full items-center justify-center">
          <span className="text-lg text-white">saving...</span>
        </div>
      </div>

      <header className="sticky top-0 z-30 flex flex-row items-center justify-between bg-background py-4">
        <h1>Account & Privacy</h1>
        <Button
          className={clsx(
            changed ? 'hover:bg-primary/60 active:bg-primary/40' : '',
            'block h-min rounded-md bg-primary py-2 px-4 text-background'
          )}
          onClick={save}
          disabled={!changed || status === 'SAVING'}
        >
          Save
        </Button>
      </header>

      <section className="mb-4 flex flex-row gap-8">
        <AvatarInput defaultSrc={user.image} />

        <div className="w-full">
          <Input
            label="Display Name"
            maxLength={12}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          {customId !== '' && (
            <Input
              label="Custom url"
              maxLength={30}
              defaultValue={customId}
              onChange={(e) => setCustomId(e.target.value)}
              // TODO: replace with window.location.host
              prefix={`https://stats.fm/`}
            />
          )}
        </div>
      </section>

      {/* bio */}
      <Textarea
        label="Bio"
        resize="none"
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={512}
      />

      {/* pronouns */}
      <label htmlFor="pronouns">Pronouns</label>
      <Menu id="pronouns" className="z-20">
        {({ open }) => (
          <>
            <Menu.Button>
              {pronoun}
              <MdArrowDropDown
                style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
              />
            </Menu.Button>

            <Menu.Items className="absolute left-0 h-48 overflow-scroll rounded-xl bg-bodySecundary p-2 px-1">
              <Menu.Item onClick={(value) => setPronoun(value)}>None</Menu.Item>
              {pronouns.map((pronoun, i) => (
                <Menu.Item
                  value={pronoun.aliases[0]}
                  onClick={(value) => setPronoun(value)}
                  key={i}
                >
                  {pronoun.aliases[0]}{' '}
                  <span>{pronoun.description.toLowerCase()}</span>
                </Menu.Item>
              ))}
            </Menu.Items>
          </>
        )}
      </Menu>
      <span className="text-sm">
        Pronouns are provided by https://pronouns.page
      </span>

      {/* privacy settings */}
      <Section
        title="Privacy settings"
        description="Choose what data should be publicy visible on your profile"
        sticky={false}
      >
        <ul>
          {privacySettings &&
            Object.entries<boolean>(
              privacySettings as unknown as { [s: string]: boolean }
            ).map(([setting, value], i) => (
              <li key={i}>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <h3>placeholder {setting}</h3>
                    <p className="m-0">placeholder description</p>
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
      </Section>
      <Section title="Danger zone" sticky={false}>
        <div className="w-full rounded-xl border border-red-500 p-5">
          <h3>Delete Account</h3>
          <Button className="mt-2">Delete my account and all my data</Button>
        </div>
      </Section>
    </main>
  );
};

const Account: NextPage<Props> = ({ pronouns }) => {
  // const api = useApi();
  const { user } = useAuth();

  if (!user) return <Container>Unauthorized</Container>;

  // useEffect(() => {
  //   (async () => {
  //     if (user?.profile) {
  //       await api.me.updateProfile({
  //         ...user.profile,
  //         pronouns: pronoun ?? undefined,
  //       });
  //     }
  //   })();
  // }, [pronoun]);

  return (
    <Container className="flex flex-row gap-12 pt-32">
      <nav className="sticky top-0 h-min shrink-0 py-4 md:w-48">
        <h3 className="mb-2">Account</h3>
        <SideNav />
      </nav>
      <StateContextProvider user={user}>
        <AccountPrivacyInfoForm pronouns={pronouns} user={user} />
      </StateContextProvider>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const res = await fetch('https://en.pronouns.page/api/pronouns').then((res) =>
    res.json()
  );

  const pronouns = Object.values(res).flat() as Pronoun[];

  return {
    props: {
      pronouns,
    },
  };
};

export default Account;
