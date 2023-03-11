import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { NextPage } from 'next';
import Head from 'next/head';

const SwipefyLanding: NextPage = () => {
  return (
    <div>
      <div id="background">
        <span id="blue-circle-container"></span>
        <span id="green-rectangle"></span>
        <span id="grey-oval"></span>
        <span id="grey-rounded-rectangle"></span>
        <span id="red-triangle"></span>
        <span id="yellow-dots"></span>
        <span id="yellow-semicircle"></span>
      </div>
      <Container className="flex min-h-screen items-center">
        <Title>Swipefy</Title>
        <Head>
          <meta
            property="og:image"
            content={
              'https://media.discordapp.net/attachments/1083785883519565977/1083787881748893706/Frame_20.png'
            }
          />
          <meta property="og:image:width" content="1024" />
          <meta property="og:image:height" content="500" />
          <meta property="og:title" content={`Swipefy by stats.fm`} />
          <meta
            property="og:description"
            content={`The all new way to discover music`}
          />
          <meta property="twitter:card" content="summary" />
        </Head>
        <div className="flex w-full flex-col justify-center pt-[30vh]">
          <h1 className="mb-0 text-center text-[5rem] font-extrabold italic text-swipefy md:text-[10rem] lg:text-[12rem] xl:text-[15rem]">
            Swipefy
          </h1>
          <p className="-mt-2 text-center text-[2rem] font-bold text-stone-500 md:-mt-10 md:text-[3rem] lg:text-[4rem] xl:text-[5rem]">
            by stats.fm
          </p>
          <p className="z-[1000] mt-[20vh] text-center text-4xl font-bold text-white md:mt-[20vh] md:text-6xl lg:mt-[30vh]">
            Click{' '}
            <a
              href="https://tally.so/r/nr5VKl"
              className="font-bold italic text-swipefy hover:underline"
              target={'_blank'}
              rel="noreferrer"
            >
              here
            </a>{' '}
            to join the waitlist
          </p>
        </div>
      </Container>
    </div>
  );
};

export default SwipefyLanding;
