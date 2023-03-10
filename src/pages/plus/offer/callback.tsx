import { Container } from '@/components/Container';
import { getApiInstance } from '@/utils/ssrUtils';
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

  const api = getApiInstance(code);
  const me = await api.me.get();

  const redirectUrl = atob(state as string);

  return {
    redirect: {
      permanent: true,
      destination: `${redirectUrl}${
        redirectUrl?.indexOf('?') === -1 ? '?' : '&'
      }cf_uivd=${me.id}&email=${me.email ?? ''}&image=${encodeURIComponent(
        me.image ?? ''
      )}`,
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
