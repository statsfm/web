import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
  gif: string;
};

export const getServerSideProps: GetServerSideProps<SSRProps<Props>> = async (
  ctx
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
          Thanks for buying stats.fm Plus!
        </h1>
        <p className="mt-2 max-w-prose font-bold text-text-grey">
          Your gift codes will show up on the{' '}
          <Link legacyBehavior href="/settings/gift#your-coupons">
            <a className="font-bold text-primary hover:underline hover:opacity-90">
              gift page
            </a>
          </Link>
          . If they aren&apos;t on the{' '}
          <Link legacyBehavior href="/settings/gift#your-coupons">
            <a className="font-bold text-primary hover:underline hover:opacity-90">
              gift page
            </a>
          </Link>
          , it could take a few hours. If you haven&apos;t received anything
          after 24 hours, send an email with your order id (sent by Stripe in
          your email) to support@stats.fm
        </p>
        <Button
          className="mt-5 max-w-fit"
          onClick={() => router.push('/settings/gift')}
        >
          Take me to the coupons page
        </Button>
      </div>
    </Container>
  );
};

export default SuccessPage;
