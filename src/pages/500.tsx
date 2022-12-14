import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { NextPage } from 'next';
import Link from 'next/link';

const ServerError: NextPage = () => {
  return (
    <Container className="flex min-h-screen items-center">
      <Title>Internal Server Error!</Title>
      <div className="flex w-full flex-col justify-center">
        <h1 className="mb-0 text-center text-[3rem] font-extrabold"></h1>
        <p className="-mt-2 text-center text-xl">
          An error occured while doing something. <br />
          Please report any bug in our{' '}
          <a
            className="text-white hover:underline"
            href="https://stats.fm/discord"
          >
            discord
          </a>{' '}
          !
        </p>
        <Link legacyBehavior href="/">
          <a className="mx-auto mt-8 w-fit rounded-xl bg-primaryLighter px-4 py-3 font-bold text-primary">
            Go back home
          </a>
        </Link>
      </div>
    </Container>
  );
};

export default ServerError;
