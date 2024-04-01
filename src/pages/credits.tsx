import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import dayjs from '@/utils/dayjs';
import clsx from 'clsx';
import {
  GetStaticProps,
  type NextPage,
  type InferGetStaticPropsType,
} from 'next';
import Link from 'next/link';

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
  const credits: {
    name: string;
    members: {
      id: number;
      name: string;
      nickname?: string;
      joined: string;
      role: string;
      nickNameIsUrl?: boolean;
      current?: boolean;
      image: string;
    }[];
  }[] = [
    {
      name: 'Tech & Development',
      members: [
        {
          id: 1,
          name: 'Sjoerd Bolten',
          nickname: 'sjoerd',
          joined: '2020-08-03 00:00:00',
          role: 'Lead Developer',
          nickNameIsUrl: true,
          image:
            'https://crowdin-static.downloads.crowdin.com/avatar/14677468/small/1995a2b0b07c1da8a3759e98e9434aff.jpeg',
        },
        {
          id: 2,
          name: 'Stijn van der Kolk',
          nickname: 'stijn',
          joined: '2021-03-01 00:00:00',
          role: 'Full Stack Developer',
          nickNameIsUrl: true,
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fusers%2Fr5o97f218wqvcpacb1bohyo6f%2F2cc961119ac6fab9573071838e88746a.webp&w=384&q=75',
        },
        {
          id: 3,
          name: 'Elias Deuss',
          nickname: 'deuss',
          joined: '2022-10-01 00:00:00',
          role: 'Flutter Developer',
          nickNameIsUrl: true,
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fusers%2Feliasdeuss%2Fb44dc2155a4407777223815fa9f04a2e.webp&w=384&q=75',
        },
        {
          id: 4,
          name: 'Daniel',
          nickname: 'daniel',
          joined: '2023-10-18 00:00:00',
          role: 'Backend Developer',
          nickNameIsUrl: true,
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fusers%2F3f3z6stu25w1330il32fywohz%2F36574354807db97f11b75abaf3d2cd72.webp&w=256&q=75',
        },
        {
          id: 5,
          name: 'Wouter de Bruijn',
          nickname: 'webdev',
          joined: '2022-09-01 00:00:00',
          role: 'Web Developer',
          nickNameIsUrl: true,
          current: false,
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fusers%2F89nvsw93neqc2nbs69u71vmzs%2F9e5665900f607733b6939ecbfbf12560.webp&w=384&q=75',
        },
        {
          id: 6,
          name: 'Martijn Faber',
          nickname: 'martijn',
          joined: '2022-06-01 00:00:00',
          role: 'Web Developer',
          nickNameIsUrl: true,
          current: false,
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fusers%2Fmartijnfaber10%2F1b351eb83cfe23dd3241e9d66a64051c.webp&w=384&q=75',
        },
      ].map((member) => ({
        ...member,
        current: member.current ?? true,
      })),
    },
    {
      name: 'Community & Support',
      members: [
        {
          id: 6,
          name: 'Stijn van der Kolk',
          nickname: 'stijn',
          joined: '2021-03-01 00:00:00',
          role: 'Community & Support Lead',
          nickNameIsUrl: true,
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fusers%2Fr5o97f218wqvcpacb1bohyo6f%2F2cc961119ac6fab9573071838e88746a.webp&w=384&q=75',
        },
        {
          id: 8,
          name: 'Guido',
          nickname: 'guido',
          joined: '2023-12-06 00:00:00',
          current: true,
          role: 'User Support',
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fplaceholders%2Fusers%2Fprivate.webp&w=384&q=75',
        },

        {
          id: 7,
          name: 'May',
          nickname: 'mayyther',
          joined: '2023-05-11 00:00:00',
          role: 'User Support',
          nickNameIsUrl: true,
          current: false,
          image:
            'https://stats.fm/_next/image?url=https%3A%2F%2Fcdn.stats.fm%2Ffile%2Fstatsfm%2Fimages%2Fusers%2Fmj72qelg0anq9s4kqq9a0m41h%2F798476a4e0d7ca1124fd1b820f426506.webp&w=384&q=75',
        },
      ].map((member) => ({
        ...member,
        current: member.current ?? true,
      })),
    },
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
    },
  };
}) satisfies GetStaticProps;

const CreditsPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  credits,
}) => {
  return (
    <>
      <Title>Credits & translators</Title>
      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row md:items-start">
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
                            className={clsx(
                              'h-10 w-10 rounded-full object-cover',
                              member.current ?? true
                                ? ''
                                : 'brightness-50 grayscale',
                            )}
                            src={member.image ?? ''}
                            alt=""
                          />
                        </div>
                        <div className="min-w-0 flex-1 px-4 pt-1 md:grid md:grid-cols-2 md:gap-4">
                          <div>
                            <p className="truncate text-lg font-bold text-white">
                              {member.name ?? ''}
                              {member.nickNameIsUrl &&
                              member.nickname !== '' ? (
                                <Link
                                  href={`/${member.nickname}`}
                                  className={clsx(
                                    'font-medium text-gray-500',
                                    member.name.trim() !== '' ? 'ml-2' : '',
                                  )}
                                >
                                  @{member.nickname}
                                </Link>
                              ) : (
                                <span
                                  className={clsx(
                                    'font-medium text-gray-500',
                                    member.name.trim() !== '' ? 'ml-2' : '',
                                  )}
                                >
                                  {member.nickname ?? ''}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="float-right hidden md:block">
                            <div className="flex shrink-0 justify-end">
                              {(member.current ?? true) && (
                                <p className="mt-3 text-sm text-gray-500">
                                  Joined{' '}
                                  <time dateTime={member.joined}>
                                    {dayjs(member.joined).fromNow()}
                                  </time>
                                </p>
                              )}
                              <p
                                className={clsx(
                                  'ml-2 inline-flex rounded-full py-1 px-3 text-sm font-semibold leading-5',
                                  member.current ?? true
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-orange-500/10 text-orange-500',
                                )}
                              >
                                {member.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      ))}
    </>
  );
};

export default CreditsPage;
