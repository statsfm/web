import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

type Props = {
  gif: string;
};

export const getServerSideProps: GetServerSideProps<SSRProps<Props>> = async (
  ctx,
) => {
  const gifs = [
    'https://c.tenor.com/BnEKiDKJisEAAAAC/claire-dancing.gif',
    'https://c.tenor.com/4-C47Bn_MUgAAAAd/friday-happy-dance.gif',
    'https://c.tenor.com/2_6lWnksyaUAAAAd/dancing-dirty.gif',
    'https://c.tenor.com/cKf7FeLja6cAAAAC/cant-wait-excited.gif',
    'https://c.tenor.com/uFy_1B10El0AAAAC/aye-ouu.gif',
    'https://c.tenor.com/LzFmt_ca1AEAAAAd/aye-aye-aye-turnup.gif',
    'https://c.tenor.com/1vzjD25uEjcAAAAC/clapping-yay.gif',
    'https://c.tenor.com/PXVgzio7BmcAAAAC/happy-dance.gif',
    'https://c.tenor.com/xgDmUszn5PYAAAAd/clapping-happy.gif',
    'https://c.tenor.com/Hrzj4EjdX58AAAAd/dance-happy.gif',
    'https://media2.giphy.com/media/26DOpJRJMhRPGqUsE/giphy.gif',
    'https://media0.giphy.com/media/3o85g2cRAMwUTuPfGM/giphy.gif',
  ];

  const gif = gifs[Math.floor(Math.random() * gifs.length)]!;
  const user = await fetchUser(ctx);

  return {
    props: {
      gif,
      user,
    },
  };
};

const SuccessPage: NextPage<Props> = ({ gif }) => {
  const router = useRouter();

  return (
    <Container className="min-h-screen pt-20">
      <div className="mt-20 grid place-items-center text-center">
        <img
          src={gif}
          alt="thank you gif"
          className="mb-5 aspect-square w-48 rounded-full bg-contain bg-center"
        />
        <h1 className="text-3xl font-bold md:text-4xl">
          Thanks for purchasing stats.fm Plus!
        </h1>
        <p className="mt-2 max-w-prose font-medium text-white opacity-70">
          Really, thank you so much for supporting the app! People like you
          allow us to invest more into the development of new features for
          everyone, including special features for you Plus users.
        </p>
        <p className="mt-2 max-w-prose font-medium text-text-grey opacity-50">
          Your Plus will probably be added to your account right away. If it
          isn&apos;t, it could take a few hours for your payment to fully go
          through. If you haven&apos;t received your Plus after 24 hours, send
          an email with your payment id (check your email) to support@stats.fm
        </p>
        <Button className="mt-5 max-w-fit" onClick={() => router.push('/me')}>
          Take me to my new Plus profile
        </Button>
      </div>
    </Container>
  );
};

export default SuccessPage;
