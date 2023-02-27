import { Container } from '@/components/Container';
import type { GetServerSideProps, NextPage } from 'next';

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { code, state } = query;

  if (typeof code !== 'string' || !code.startsWith('ey')) {
    return {
      redirect: {
        permanent: true,
        destination: '/404',
      },
    };
  }

  // @ts-expect-error error because of atob
  const { userId } = JSON.parse(atob((code as string).split('.')[1]) as string);
  const redirectUrl = atob(state as string);

  return {
    redirect: {
      permanent: true,
      destination: `${redirectUrl}${
        redirectUrl?.indexOf('?') === -1 ? '?' : '&'
      }cf_uivd=${userId + userId}`,
    },
  };
};

const SuccessPage: NextPage<Props> = () => {
  return (
    <Container className="min-h-screen pt-20">
      <div className="mt-20 grid place-items-center text-center"></div>
    </Container>
  );
};

export default SuccessPage;
