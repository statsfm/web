import { Container } from '@/components/Container';
import { StoreBadge } from '@/components/StoreBadges';
import { Title } from '@/components/Title';
import type { NextPage } from 'next';

const ComparePage: NextPage = () => {
  return (
    <Container className="flex min-h-screen items-center">
      <Title>Comming soon</Title>
      <div className="flex w-full flex-col justify-center">
        <h1 className="mb-0 text-center text-4xl font-extrabold sm:text-[5rem]">
          Comming soon,
        </h1>
        <p className="mt-4 text-center text-lg sm:-mt-2">
          We are hard at work to bring this functionality to the website,
        </p>
        <p className="-mt-1 text-center text-lg sm:-mt-2 ">
          for now you can use the app.
        </p>
        <div className=" mx-auto mt-8 flex w-fit flex-col items-center gap-2">
          <StoreBadge store="apple" />
          <StoreBadge store="google" />
        </div>
      </div>
    </Container>
  );
};

export default ComparePage;
