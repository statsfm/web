import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { NextPage } from 'next';

const CreditsPage: NextPage = () => {
  return (
    <Container className="flex min-h-screen items-center">
      <Title>Coming soon</Title>
      <div className="flex w-full flex-col justify-center">
        <h1 className="mb-0 text-center text-4xl font-extrabold sm:text-[5rem]">
          Coming soon,
        </h1>
        <p className="mt-4 text-center text-lg sm:-mt-2">
          we are working hard on creating the list with credits.
          <br className="mb-1 sm:mb-0" />
          Please check again later.
        </p>
      </div>
    </Container>
  );
};

export default CreditsPage;
