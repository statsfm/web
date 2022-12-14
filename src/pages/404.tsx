import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { NextPage } from 'next';
import Link from 'next/link';

const NotFound: NextPage = () => {
  return (
    <Container className="flex min-h-screen items-center">
      <Title>Page not found!</Title>
      <div className="flex w-full flex-col justify-center">
        <h1 className="mb-0 text-center text-[4rem] font-extrabold">
          Whoops...
        </h1>
        <p className="-mt-2 text-center text-xl">This page doesnt exist</p>
        <Link legacyBehavior href="/">
          <a className="mx-auto mt-8 w-fit rounded-xl bg-primaryLighter px-4 py-3 text-primary">
            Go back home
          </a>
        </Link>
      </div>
    </Container>
  );
};

export default NotFound;
