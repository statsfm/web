import { Title } from '@/components/Title';
import type { NextPage } from 'next';

const NotFound: NextPage = () => {
  return (
    <>
      <Title>Page not found!</Title>
      <h1 className="text-center text-6xl font-extrabold">404</h1>
    </>
  );
};

export default NotFound;
