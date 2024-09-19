import { Container } from '@/components/Container';
import { Section } from '@/components/Section/Section';
import { Title } from '@/components/Title';
import type { SSRProps } from '@/utils/ssrUtils';
import { getApiInstance, fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import type * as statsfm from '@/utils/statsfm';
import { useApi, useAuth } from '@/hooks';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/Avatar';
import Link from 'next/link';
import { useMedia } from 'react-use';
import { Skeleton } from '@/components/Skeleton';
import { MdChevronLeft, MdVisibilityOff } from 'react-icons/md';
import formatter from '@/utils/formatter';
import Scope from '@/components/PrivacyScope';

type Props = SSRProps<{
  userProfile: statsfm.UserPublic;
  friendCount: number;
}>;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const id = ctx.params?.id?.toString();

  if (!id) {
    throw new Error('no param id recieved');
  }

  const userProfile = await api.users.get(id).catch(() => null);
  if (!userProfile) {
    return {
      notFound: true,
    };
  }

  const user = await fetchUser(ctx);
  const userProfileId = encodeURIComponent(userProfile.id);
  const friendCount = await api.users.friendCount(userProfileId).catch(() => 0);

  return {
    props: {
      userProfileId,
      userProfile,
      user,
      friendCount,
    },
  };
};

const FriendsPage: NextPage<Props> = ({ userProfile, friendCount }) => {
  const api = useApi();
  const { user } = useAuth();

  const mobile = useMedia('(max-width: 640px)');
  const [friends, setFriends] = useState<statsfm.UserPublic[]>([]);

  const userProfileId = encodeURIComponent(userProfile.id);

  useEffect(() => {
    api.users.friends(userProfileId).then(setFriends);
  }, [userProfileId]);

  return (
    <>
      <Title>{`${userProfile.displayName}'s friends`}</Title>
      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pb-10 pt-24 md:flex-row md:items-start">
            <div className="flex w-full flex-col justify-end">
              <Link
                legacyBehavior
                href={`/${userProfile.customId || userProfileId}`}
              >
                <a className="-mb-3 flex items-center text-lg text-white">
                  <MdChevronLeft className="-mr-1 block h-12 w-6 text-white" />
                  back to {userProfile.displayName}
                </a>
              </Link>
              <h1 className="text-4xl text-white sm:text-5xl md:text-left">
                {formatter.nounify(userProfile.displayName)}{' '}
                <span className="text-white">
                  {formatter.pluralise('friend', friendCount)}
                </span>
              </h1>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-4">
        <Section>
          <Scope.Context
            as={user}
            target={userProfile}
            fallback={
              <div className="grid w-full place-items-center">
                <MdVisibilityOff />
                <p className="m-0 text-text-grey">
                  {userProfile.displayName} doesn&apos;t share this
                </p>
              </div>
            }
          >
            <Scope value="friends">
              <ul className="grid grid-cols-2 gap-4 gap-y-12 md:grid-cols-3 lg:grid-cols-6 ">
                {friendCount === 0 && (
                  <span className="col-span-full my-4 text-lg">
                    Sadly, {userProfile.displayName} has no friends yet ;(
                  </span>
                )}
                {friendCount > 0 &&
                  friends.length > 0 &&
                  friends.map((friend) => (
                    <li key={friend.id} className="mx-auto">
                      <Link
                        legacyBehavior
                        href={`/${friend.customId || friend.id}`}
                        passHref
                      >
                        <a className="flex flex-col items-center">
                          <Avatar
                            src={friend.image}
                            name={friend.displayName}
                            size={mobile ? '2xl' : '3xl'}
                          />
                          <div className="mt-2 text-center">
                            <h4 className="line-clamp-2 w-full break-all">
                              {friend.displayName}
                            </h4>
                            <span>{friend.profile?.pronouns}</span>
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
            </Scope>
          </Scope.Context>
        </Section>
      </Container>
    </>
  );
};

export default FriendsPage;
