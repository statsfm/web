import { Avatar } from '@/components/Avatar';
import { Menu } from '@/components/Menu';
import { useApi, useAuth } from '@/hooks';
import type { GetServerSideProps, NextPage } from 'next';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Textarea } from '@/components/Textarea';
import { Input } from '@/components/Input';
import { MdArrowDropDown, MdCameraEnhance } from 'react-icons/md';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import type { UserPrivate } from '@statsfm/statsfm.js';

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

const AvatarInput: FC<{ user: UserPrivate }> = ({ user }) => {
  const [hovering, setHovering] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
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
          src={previewUrl || user.image}
          name={user.displayName || ''}
          size="3xl"
        />

        <div
          className={clsx(
            hovering ? 'opacity-40' : 'opacity-0',
            'absolute top-0 h-full w-full rounded-full bg-black transition-opacity'
          )}
        />
        <div className="absolute right-0 bottom-0 flex h-10 w-10 items-center justify-center rounded-full bg-bodySecundary">
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

const Account: NextPage<Props> = ({ pronouns }) => {
  const api = useApi();
  const { user } = useAuth();

  const [pronoun, setPronoun] = useState<string>();

  useEffect(() => {
    setPronoun(user?.profile?.pronouns);
  }, [user]);

  useEffect(() => {
    (async () => {
      if (user?.profile) {
        await api.me.updateProfile({
          ...user.profile,
          pronouns: pronoun ?? undefined,
        });
      }
    })();
  }, [pronoun]);

  if (!user) return <Container>Unauthorized</Container>;

  return (
    <>
      <Container className="flex flex-row gap-12 pt-32">
        <nav className="sticky top-0 h-min shrink-0 py-4 md:w-48">
          <h3 className="mb-2">Account</h3>
          <SideNav />
        </nav>
        <main className="w-full">
          <header className="sticky top-0 z-20 flex flex-row items-center justify-between bg-background py-4">
            <h1>Account & Privacy</h1>
            <button className="block h-min rounded-md bg-primary py-2 px-4 text-background">
              save
            </button>
          </header>

          <section className="mb-4 flex flex-row gap-8">
            <AvatarInput user={user} />

            <div className="w-full">
              <Input
                label="Display Name"
                maxLength={12}
                defaultValue={user.displayName}
              />

              {user?.customId && (
                <Input
                  label="Custom url"
                  maxLength={30}
                  defaultValue={user.customId}
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
            defaultValue={user?.profile?.bio}
            maxLength={512}
          />

          {/* pronouns */}
          <label htmlFor="pronouns">Pronouns</label>
          <Menu id="pronouns" className="z-20">
            {({ open }) => (
              <>
                <Menu.Button>
                  {pronoun}{' '}
                  <MdArrowDropDown
                    style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
                  />
                </Menu.Button>

                <Menu.Items>
                  <Menu.Item onClick={(value) => setPronoun(value)}>
                    None
                  </Menu.Item>
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
              {user?.privacySettings &&
                Object.entries(user.privacySettings).map(([setting], i) => (
                  <li key={i}>
                    <p>{setting}</p>
                  </li>
                ))}
            </ul>
          </Section>
        </main>
      </Container>
    </>
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
