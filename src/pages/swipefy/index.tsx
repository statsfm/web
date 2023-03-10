import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { NextPage } from 'next';

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
        <div className="z-[1000] flex w-full flex-col justify-center pt-[30vh]">
          <h1 className="mb-0 text-center text-[5rem] font-extrabold italic text-swipefy md:text-[10rem] lg:text-[12rem] xl:text-[15rem]">
            Swipefy
          </h1>
          <p className="-mt-2 text-center text-[2rem] font-bold text-stone-500 md:-mt-10 md:text-[3rem] lg:text-[4rem] xl:text-[5rem]">
            by stats.fm
          </p>
          <p className="mt-[20vh] text-center text-4xl font-bold text-white md:mt-[20vh] md:text-6xl lg:mt-[30vh]">
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
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </Container>
    </div>
  );
};

export default SwipefyLanding;
