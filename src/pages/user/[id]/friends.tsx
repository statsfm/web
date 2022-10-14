import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Title } from '@/components/Title';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import type * as statsfm from '@statsfm/statsfm.js';
import { useApi } from '@/hooks';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/Avatar';
import Link from 'next/link';
import { useMedia } from 'react-use';
import { Skeleton } from '@/components/Skeleton';

type Props = SSRProps<{ userProfile: statsfm.UserPublic; friendCount: number }>;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi();
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  const userProfile = await api.users.get(id).catch(() => {});
  if (!userProfile) return { notFound: true };
  const friendCount = await api.users.friendCount(userProfile.id);
  const user = await fetchUser(ctx);

  return {
    props: {
      userProfile,
      user,
      friendCount,
    },
  };
};

const FriendsPage: NextPage<Props> = ({ userProfile, friendCount }) => {
  const api = useApi();

  const mobile = useMedia('(max-width: 640px)');
  const [friends, setFriends] = useState<statsfm.UserPublic[]>([]);

  useEffect(() => {
    api.users.friends(userProfile.id).then((res) => setFriends(res));
  }, []);

  return (
    <>
      <Title>{`${userProfile.displayName}'s friends`}</Title>
      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
            <div className="flex flex-col justify-end">
              <h1 className="text-center text-5xl font-extrabold capitalize md:text-left">
                <Link href={`/${userProfile.customId}`}>
                  <a className="flex items-center">
                    {/* <MdChevronLeft className="block h-12 w-max" /> */}
                    {userProfile.displayName}
                  </a>
                </Link>
              </h1>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-4">
        <Section title="Friends">
          <ul className="grid grid-cols-2 gap-4 gap-y-12 md:grid-cols-3 lg:grid-cols-5 ">
            {friendCount === 0 && (
              <span className="col-span-full my-4 text-lg">
                Sadly, {userProfile.displayName} has no friends yet ;(
              </span>
            )}
            {friendCount > 0 &&
              friends.length > 0 &&
              friends.map((friend) => (
                <li key={friend.id} className="mx-auto">
                  <Link href={`/${friend.customId}`} passHref>
                    <a className="flex flex-col items-center">
                      <Avatar
                        src={friend.image}
                        name={friend.displayName}
                        size={mobile ? '2xl' : '4xl'}
                      />
                      <div className="mt-2 text-center">
                        <h4 className="line-clamp-2">{friend.displayName}</h4>
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
            {friendCount > 0 &&
              friends.length === 0 &&
              Array(friendCount)
                .fill(null)
                .map((_v, i) => {
                  return (
                    <li key={i} className="mx-auto">
                      <Skeleton.Avatar size={mobile ? '2xl' : '4xl'} />
                      <div className="mt-2 flex w-full justify-center">
                        <Skeleton.Text width="8em" />
                      </div>
                    </li>
                  );
                })}
          </ul>
        </Section>
      </Container>
    </>
  );
};

export default FriendsPage;
