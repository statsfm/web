import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

type Props = {
  code: number;
  title: string;
  message: string;
  action: string;
  url: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // parse base64 to string text
  const parsedData = Buffer.from(
    ctx.params?.data?.toString() ?? '',
    'base64'
  ).toString();

  // TODO: remove temp data and make it work with real data
  const data = {
    code: 403,
    title: 'Forbidden error',
    message: 'Please login first',
    action: 'Login',
    url: 'https://stats.fm/login',
  };

  ctx.res.statusCode = data.code;
  return {
    props: data,
  };
};

const MessagePage: NextPage<Props> = (data) => {
  return (
    <Container className="flex min-h-screen items-center">
      <Title>{data.title}</Title>
      <div className="flex w-full flex-col justify-center">
        <h1 className="mb-0 text-center text-[5rem] font-extrabold">
          {data.title}
        </h1>
        <p className="-mt-2 text-center text-xl">{data.message}</p>
        <Link legacyBehavior href={data.url}>
          <a className="mx-auto mt-8 w-fit rounded-xl bg-primaryLighter px-4 py-3 text-primary">
            {data.action}
          </a>
        </Link>
      </div>
    </Container>
  );
};

export default MessagePage;
