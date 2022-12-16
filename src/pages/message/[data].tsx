import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

type BaseProps = {
  code: number;
  title: string;
  message: string;
  action?: string | null;
  url?: string | null;
};

type Props = BaseProps | Required<BaseProps>;

const unparseData = (unparsedData: string): Props => {
  const vars = unparsedData.split(';');

  const mappedVars = vars
    .map<{ [K in keyof Props]: Props[K] }>((v) => {
      const [key, value] = v.split('=');
      if (key === 'code' && value) return { code: parseInt(value, 10) };
      if (key && value) return { [key]: decodeURIComponent(value) };
      return null as any;
    })
    .filter((v) => v);

  const data = mappedVars.reduce(
    (acc, curr) => ({ ...acc, ...curr }),
    {} as Props
  );
  // Insert default vars
  return {
    code: data.code ?? 400,
    title: data.title ?? 'Error',
    message: data.message ?? 'Something went wrong',
    action: data.action ?? null,
    url: data.url ?? null,
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  // parse base64 to string text
  const parsedData = Buffer.from(
    ctx.params?.data?.toString() ?? '',
    'base64'
  ).toString();

  const data = unparseData(parsedData);

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
        <h2 className="mb-0 text-center text-3xl font-bold lg:text-[3rem]">
          <span className="mr-2 text-gray-500">{data.code}</span>
          {data.title}
        </h2>
        <p className="-mt-2 text-center text-xl">{data.message}</p>
        {data.action && data.url && (
          <Link legacyBehavior href={data.url}>
            <a className="mx-auto mt-8 w-fit rounded-xl bg-primaryLighter px-5 py-2 font-bold text-primary">
              {data.action}
            </a>
          </Link>
        )}
      </div>
    </Container>
  );
};

export default MessagePage;
