import { Container } from '@/components/Container';
import type { GetServerSideProps, NextPage } from 'next';

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { url } = query;

  if (
    typeof url !== 'string' ||
    (!url.startsWith('https://plus.stats.fm') &&
      !url.startsWith('https://digitalmarketerhk-app.clickfunnels.com/'))
  ) {
    return {
      redirect: {
        permanent: true,
        destination: '/404',
      },
    };
  }

  const authUrl = `https://api.stats.fm/api/v1/auth/redirect/spotify?scope=user-read-email&redirect_uri=https://stats.fm/plus/offer/callback&state=${btoa(
    url
  )}`;

  return {
    redirect: {
      permanent: true,
      destination: authUrl,
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
