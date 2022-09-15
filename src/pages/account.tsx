import { Avatar } from '@/components/Avatar';
import { Menu } from '@/components/Menu';
import { useApi, useAuth } from '@/hooks';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/Textarea';
import { Input } from '@/components/Input';
import { MdArrowDropDown } from 'react-icons/md';
import { Section } from '@/components/Section';

type Pronoun = { aliases: string[]; description: string };

interface Props {
  pronouns: Pronoun[];
}

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

  return (
    <>
      <Avatar src={user?.image} name={user?.displayName || ''} size="4xl" />

      {/* custom url */}
      {user?.customId && (
        <Input
          label="Custom url"
          maxLength={30}
          defaultValue={user.customId}
          // TODO: replace with window.location.host
          prefix={`https://stats.fm/`}
        />
      )}

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
      <Menu id="pronouns">
        {({ open }) => (
          <>
            <Menu.Button>
              {pronoun}{' '}
              <MdArrowDropDown
                style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
              />
            </Menu.Button>

            <Menu.Items>
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
    </>
  );
};

export default Account;
