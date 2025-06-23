import { AccountLayout } from '@/components/settings/Layout';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Menu } from '@/components/Menu';
import { Overlay } from '@/components/Overlay';
import { Section } from '@/components/Section/Section';
import { Textarea } from '@/components/Textarea';
import { useApi, useAuth, useToaster } from '@/hooks';
import type { UserPrivate } from '@/utils/statsfm';
import clsx from 'clsx';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { Dispatch, FC, PropsWithChildren } from 'react';
import {
  useEffect,
  useRef,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  MdArrowDropDown,
  MdCameraEnhance,
  MdCancel,
  MdCheckCircle,
} from 'react-icons/md';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';

type StatusOptions = 'SAVING' | 'SAVED' | 'ERROR' | 'DEFAULT' | 'DELETING';
type UrlAvailableOptions = 'LOADING' | 'AVAILABLE' | 'UNAVAILABLE';

type StateContextType = {
  avatarFiles: [FileList | null, Dispatch<FileList | null>];
  displayName: [string, Dispatch<string>];
  customId: [string, Dispatch<string>];
  bio: [string, Dispatch<string>];
  pronouns: [string | null, Dispatch<string | null>];
  status: [StatusOptions, Dispatch<StatusOptions>];
  urlAvailable: [UrlAvailableOptions, Dispatch<UrlAvailableOptions>];
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
  const [pronouns, setPronouns] = useState<string | null>(
    user.profile?.pronouns ?? null,
  );
  const [urlAvailable, setUrlAvailable] =
    useState<UrlAvailableOptions>('AVAILABLE');

  const [status, setStatus] = useState<StatusOptions>('DEFAULT');

  const changed = useMemo(
    () =>
      (files?.length ?? 0) > 0 ||
      displayName !== user.displayName ||
      customId !== user.customId ||
      bio !== user.profile?.bio ||
      pronouns !== (user.profile?.pronouns ?? 'none'),
    [files, displayName, customId, bio, pronouns, user],
  );

  const uploadAvatar = useCallback(async () => {
    if (files && files.length > 0 && files[0]) {
      const { image } = await api.me.uploadAvatar(files[0]);

      setFiles(null);
      return image;
    }

    return null;
  }, [files]);

  const save = async () => {
    setStatus('SAVING');
    try {
      const profileUpdate = {
        bio,
        pronouns,
        theme: user.profile?.theme ?? 'green',
      };

      const userUpdate = {
        ...user,
        ...(!user.isPlus ? { syncEnabled: false, hasImported: false } : {}),
        displayName,
        customId,
      };

      const [updatedUser, updatedProfile] = await Promise.all([
        api.me.updateMe(userUpdate),
        api.me.updateProfile(profileUpdate),
      ]);

      const url = await uploadAvatar();

      updateUser({
        ...updatedUser,
        image: url ?? user.image,
        profile: updatedProfile,
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
        pronouns: [pronouns, setPronouns],
        status: [status, setStatus],
        urlAvailable: [urlAvailable, setUrlAvailable],
        changed,
        save,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

const AvatarInput: FC<{ defaultSrc: string | undefined }> = ({
  defaultSrc,
}) => {
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
        className="relative mx-auto mb-4 mt-6 size-min cursor-pointer sm:my-0"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Avatar
          src={previewUrl ?? defaultSrc}
          name={displayName ?? ''}
          size="3xl"
        />

        <div
          className={clsx(
            hovering ? 'opacity-40' : 'opacity-0',
            'absolute top-0 size-full rounded-full bg-black transition-opacity',
          )}
        />
        <div className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border-4 border-background bg-foreground">
          <MdCameraEnhance
            size="22px"
            className={clsx(
              hovering ? 'text-primary' : '',
              'transition-colors',
            )}
          />
        </div>
      </label>
    </>
  );
};

const AvailibilityIndicator: FC<{ user: UserPrivate }> = ({ user }) => {
  const api = useApi();
  const {
    urlAvailable: [urlAvailable, setUrlAvailable],
    customId: [customId],
  } = useContext(stateContext)!;

  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);

    if (customId === user.customId) {
      setUrlAvailable('AVAILABLE');
      return;
    }

    if (!customId || customId.length <= 2) {
      setUrlAvailable('UNAVAILABLE');
      return;
    }

    if (urlAvailable !== 'LOADING') setUrlAvailable('LOADING');
    timeout.current = setTimeout(async () => {
      const res = await api.me.customIdAvailable(customId);
      setUrlAvailable(res ? 'AVAILABLE' : 'UNAVAILABLE');
    }, 500);
  }, [customId]);

  if (urlAvailable === 'LOADING')
    return <span className="text-sm">checking...</span>;

  if (urlAvailable === 'UNAVAILABLE')
    return (
      <>
        <MdCancel className="h-5 text-red-600" />
        <span className="hidden text-sm text-red-600 sm:block">
          Unavailable
        </span>
      </>
    );

  return (
    <>
      <MdCheckCircle className="h-5 text-primary" />
      <span className="hidden text-sm text-primary sm:block">Available</span>
    </>
  );
};

const DeleteAccount: FC = () => {
  const { error } = useToaster();
  const { login, logout, tokenAge } = useAuth();
  const { status } = useContext(stateContext)!;
  const router = useRouter();
  const api = useApi();

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [_status, setStatus] = status;

  const [timeLeft, setTimeLeft] = useState(0);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const age = tokenAge();
    if (age) {
      setTimeLeft(Math.floor(60 - age));
    }

    const interval = setInterval(() => {
      setTimeLeft((timeleft) => timeleft - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const deleteAccount = useCallback(async () => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action is irreversible!',
    );
    if (!confirmed) return;
    setStatus('DELETING');

    try {
      await api.me.deleteAccount();
      logout();
      router.push('/');
    } catch (e) {
      error(`Account could not be deleted: ${e}`);
      setStatus('DEFAULT');
    }
  }, []);

  return (
    <Section title="Danger zone" sticky={false}>
      <div className="w-full rounded-xl border border-red-500 p-5">
        <h3>Delete Account</h3>
        <p>
          Before you can delete your data you must login with your Spotify
          account to confirm it&apos;s you. After logging in you have 60 seconds
          to delete your account; after that you have to login again to proceed.
          <br />
          <br />
          Please note that deleting your account also deletes all giftcodes
          (claimed or unclaimed).
        </p>
        {timeLeft > 0 ? (
          <>
            <div className="mb-2 flex flex-row items-start">
              <input
                className="mr-2 mt-1"
                type="checkbox"
                id="confirm"
                onChange={(e) => setAgreed(e.target.checked)}
                checked={agreed}
              />
              <label htmlFor="confirm">
                I acknowledge that this action is irreversable and this will
                delete all my data such as:
                <br />
                - Any purchases I&apos;ve made (for example for stats.fm Plus or
                Swipefy Pro)
                <br />
                - Any automatically syncing playlists I&apos;ve made
                <br />
                - Any streams I&apos;ve imported / synced
                <br />
                - Any friend (requests)
                <br />
                - Swipefy collections
                <br />- Swipefy swipes
              </label>
            </div>

            <Button
              className="mt-2 max-w-full !text-sm sm:text-base"
              onClick={deleteAccount}
              disabled={!agreed}
            >
              Delete my account and all my data, {timeLeft}s left
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              logout();
              login(router.asPath);
            }}
            className="mt-2"
          >
            Login
          </Button>
        )}
      </div>
    </Section>
  );
};

type AccountPrivacyInfoFormProps = {
  pronouns: Pronoun[];
  user: UserPrivate;
};

const AccountPrivacyInfoForm: FC<AccountPrivacyInfoFormProps> = ({
  pronouns,
  user,
}) => {
  const {
    displayName: [displayName, setDisplayName],
    customId: [customId, setCustomId],
    bio: [bio, setBio],
    pronouns: [pronoun, setPronoun],
    status: [status],
    urlAvailable: [urlAvailable],
    changed,
    save,
  } = useContext(stateContext)!;

  const statusMessage = useMemo(() => {
    if (status === 'SAVING') return 'Saving...';
    if (status === 'DELETING') return 'Deleting...';
    return '';
  }, [status]);

  return (
    <div className="relative w-full">
      <Overlay visible={['SAVING', 'DELETING'].includes(status)}>
        {statusMessage}
      </Overlay>
      <SettingsHeader title="Profile">
        <Button
          className={clsx(
            changed ? 'hover:!bg-primary/60 active:!bg-primary/40' : '',
            'block h-min rounded-md !bg-primary px-4 py-2 !text-background',
          )}
          onClick={save}
          disabled={
            !changed || urlAvailable !== 'AVAILABLE' || status === 'SAVING'
          }
        >
          Save
        </Button>
      </SettingsHeader>

      <section className="flex flex-col sm:mb-4 sm:flex-row sm:gap-8">
        <AvatarInput defaultSrc={user.image} />

        <div className="w-full">
          <Input
            label="Display Name"
            maxLength={12}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <Input
            label="Custom url"
            maxLength={30}
            defaultValue={customId}
            onChange={(e) => setCustomId(e.target.value)}
            // TODO: replace with window.location.host
            prefix={`https://stats.fm/`}
            suffix={<AvailibilityIndicator user={user} />}
          />
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
      <label className="font-medium" htmlFor="pronouns">
        Pronouns
      </label>
      <Menu id="pronouns" className="z-20">
        {({ open }) => (
          <>
            <Menu.Button>
              <div className="z-20 flex">
                {pronoun ?? 'none'}
                <MdArrowDropDown
                  style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
                />
              </div>
            </Menu.Button>

            <Menu.Items
              placement="bottom-start"
              className="absolute z-30 -mt-2 h-64 !overflow-y-scroll rounded-lg bg-foreground p-2 px-1"
            >
              <Menu.Item value="none" onClick={() => setPronoun(null)}>
                none
              </Menu.Item>
              {pronouns.map(({ aliases: [name], description }, i) => (
                <Menu.Item
                  value={name}
                  onClick={(value) => setPronoun(value)}
                  key={i}
                >
                  {name} <span>{description.toLowerCase()}</span>
                </Menu.Item>
              ))}
            </Menu.Items>
          </>
        )}
      </Menu>
      <span className="text-sm">
        Pronouns are provided by https://pronouns.page
      </span>
      <DeleteAccount />
    </div>
  );
};

type Pronoun = { aliases: string[]; description: string };

type Props = SSRProps<{
  pronouns: Pronoun[];
}>;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = await fetchUser(ctx);
  const pronounsResponse = await fetch(
    'https://api.stats.fm/api/v1/me/available-pronouns',
  );
  const { items: pronounsItems } = await pronounsResponse.json();
  const pronouns = Object.values<Pronoun>(pronounsItems).filter(
    ({ aliases }) => aliases.length !== 0,
  );

  return {
    props: {
      pronouns,
      user,
    },
  };
};

const ProfilePage: NextPage<Props> = ({ pronouns }) => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <AccountLayout>
      <StateContextProvider user={user}>
        <AccountPrivacyInfoForm pronouns={pronouns} user={user} />
      </StateContextProvider>
    </AccountLayout>
  );
};

export default ProfilePage;
