import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import dayjs from '@/utils/dayjs';
import clsx from 'clsx';
import type { GetStaticProps, NextPage, InferGetStaticPropsType } from 'next';

export const getStaticProps = (async () => {
  const res = await fetch('https://translate-credits.stats.fm');
  const translatorCredits = (await res.json()) as {
    id: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
    joinDate: string;
    role: string;
    avatarUrl: string;
  }[];
  const credits = [
    {
      name: 'Translators',
      members: translatorCredits.map((translator) => ({
        id: translator.id,
        name: `${translator.firstName ?? ''} ${translator.lastName ?? ''}`,
        nickname: translator.username,
        joined: translator.joinDate,
        role: translator.role,
        image: translator.avatarUrl,
      })),
    },
  ];
  return {
    props: {
      credits,
      lastFetched: dayjs().toISOString(),
    },
  };
}) satisfies GetStaticProps;

const CreditsPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  credits,
  lastFetched,
}) => {
  return (
    <>
      <Title>Credits & translators</Title>
      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pb-10 pt-24 md:flex-row md:items-start">
            <div className="flex w-full flex-col justify-end">
              {/* <a className="-mb-3 flex items-center text-lg text-white">
                ---
              </a> */}
              <h1 className="text-4xl text-white sm:text-5xl md:text-left">
                Credits
              </h1>
            </div>
          </section>
        </Container>
      </div>

      {credits.map(({ name, members }) => (
        <Container key={name}>
          <div className="mt-10 flex w-full flex-col justify-center">
            <h2 className="mb-0 text-3xl font-bold">
              {name}
              <span className="ml-2 text-gray-500">({members.length})</span>
            </h2>
            <div className="overflow-hidden bg-transparent shadow sm:rounded-md">
              <ul>
                {members.map((member) => (
                  <li key={member.id}>
                    <div className="flex items-center py-2">
                      <div className="flex min-w-0 flex-1 items-center">
                        <div className="shrink-0">
                          <img
                            className="size-10 rounded-full object-cover"
                            src={member.image ?? ''}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1 px-4 pt-1 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="truncate text-lg font-bold text-white">
                              {member.name ?? ''}
                              <span
                                className={clsx(
                                  'font-medium text-gray-500',
                                  member.name.trim() !== '' ? 'ml-2' : '',
                                )}
                              >
                                {member.nickname ?? ''}
                              </span>
                            </p>
                          </div>
                          <div className="float-right hidden md:block">
                            <div className="flex shrink-0 justify-end">
                              <p className="mt-3 text-sm text-gray-500">
                                Joined{' '}
                                <time dateTime={member.joined}>
                                  {dayjs(member.joined).fromNow()}
                                </time>
                              </p>
                              <p
                                className={clsx(
                                  'ml-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold leading-5',
                                  'bg-primary/10 text-primary',
                                )}
                              >
                                {member.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      ))}
      <Container>
        <p>
          Last fetched:{' '}
          <time dateTime={lastFetched}>{dayjs(lastFetched).fromNow()}</time> (
          {dayjs(lastFetched).format('MMMM D, YYYY [at] HH:mm')})
        </p>
      </Container>
    </>
  );
};

export default CreditsPage;
