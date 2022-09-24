import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

type Props = {
  gif: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
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

  return {
    props: {
      gif,
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
          Thanks for buying Spotistats Plus!
        </h1>
        <p className="mt-2 max-w-prose font-bold text-text-grey">
          Your gift codes will probably be there right away. If they aren&apos;t
          there, it could take a few hours. If you haven&apos;t received
          anything after 24 hours, send an email with your payment id to
          giftcodes@spotistats.app
        </p>
        <Button className="mt-5 max-w-fit" onClick={() => router.push('/gift')}>
          Take me to the coupons page
        </Button>
      </div>
    </Container>
  );
};

export default SuccessPage;
