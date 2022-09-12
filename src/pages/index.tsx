import { Container } from '@/components/Container';
import { StoreBadge } from '@/components/StoreBadges';
import type { NextPage } from 'next';
import type { FC, PropsWithChildren } from 'react';
import { MdChevronRight } from 'react-icons/md';

type Props = PropsWithChildren<{ href: string }>;

const ChevronLink: FC<Props> = ({ children, href }) => {
  return (
    <a
      href={href}
      className="flex flex-row items-center font-bold text-primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children} <MdChevronRight className="inline" />
    </a>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Container className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="my-12 w-full pt-10 lg:my-28 lg:w-5/12">
          <h1 className="text-5xl leading-none">
            Your music,
            <br />
            <span className="font-extrabold opacity-30">your</span> stats,
            <br />
            <span className="font-extrabold opacity-30">your</span> story.
          </h1>
          <p className="mb-5">
            Enter a new dimension of music by getting unique insights into your
            music taste.
          </p>
          <ChevronLink href="https://spotistats.app/plus-demo">
            Watch the video
          </ChevronLink>
          <div className="mt-8 flex flex-col items-center gap-2 md:flex-row">
            <StoreBadge store="apple" />
            <StoreBadge store="google" />
          </div>
        </div>
        <div className="mb-10 flex w-full items-end lg:w-7/12">
          <img
            className="object-contain"
            src="/images/app_3.webp"
            alt="Desktop Mobile"
          />
        </div>
      </Container>
      <section className="-mt-10 bg-bodySecundary py-28"></section>
    </>
  );
};

export default Home;
