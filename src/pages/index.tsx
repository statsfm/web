import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import { StoreBadge } from '@/components/StoreBadges';
import type { NextPage } from 'next';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';
import {
  MdChevronRight,
  MdFormatListBulleted,
  MdHistory,
  MdLock,
  MdShowChart,
} from 'react-icons/md';

const ChevronLink: FC<PropsWithChildren<{ href: string }>> = ({
  children,
  href,
}) => {
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

const FeatureItem: FC<PropsWithChildren<{ title: string; Icon: IconType }>> = ({
  title,
  Icon,
  children,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="grid aspect-square min-w-[3rem] place-items-center rounded-full bg-primaryLighter text-xl font-bold text-primary">
        <Icon color="#1ed760" />
      </div>
      <div className="flex flex-col align-middle">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-neutral-400">{children}</p>
      </div>
    </div>
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
      <section className="-mt-10 bg-bodySecundary py-28">
        <Container className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="mb-5 hidden w-full justify-center lg:flex lg:w-6/12">
            <img
              src="/images/app_2.webp"
              alt="app"
              className="w-60 object-contain transition-transform duration-200 hover:scale-[1.02] lg:w-auto"
            />
          </div>
          <div className="w-full lg:w-6/12">
            <h1>Easy, extensive and secure</h1>
            <p>
              With the click of a button you&apos;ll be logged with your Spotify
              account and you&apos;ll instantly gain access to a valhalla of
              cool stats and insights
            </p>
            <div className="mt-5 mb-8 flex flex-col gap-3">
              <FeatureItem Icon={MdLock} title="Safe & secure">
                Privacy is key, and I&apos;ve build the platform keeping
                security and privacy at the highest priority. As far as
                possible, all data is saved anonymously, and is stored and
                transferred fully encrypted. Unless you import your streaming
                history no data is saved on the servers.
              </FeatureItem>
              <FeatureItem
                Icon={MdShowChart}
                title="Enhanced personalized stats"
              >
                Thanks to state of the art algorithms you&apos;ll always be
                welcomed with relevant, advanced and personalized stats for each
                item you click on.
              </FeatureItem>
              <FeatureItem
                Icon={MdFormatListBulleted}
                title="Top tracks, artists and albums at a glance*"
              >
                Of course most people are here to check their top lists, which
                becomes an amazing experience on this platform. For example:
                order the lists by times played, minutes streamed or by advanced
                machine learning!
              </FeatureItem>
              <FeatureItem
                Icon={MdHistory}
                title="Import your lifetime history*"
              >
                Follow the unique import process to import your lifetime
                streaminghistory and unlock the full potential of the platform
                by getting access to lots of cool features. It&apos;s really
                cool, I promise : )
              </FeatureItem>
              <p>
                *{' '}
                <Link href="import">
                  <a className="text-white hover:opacity-80">
                    import of streaming history
                  </a>
                </Link>{' '}
                may be required to unlock (part of) this feature
              </p>
            </div>
            <Divider invert className="border-neutral-600" />
            {/* TODO: fix the total stats */}
            {/* <TotalStats className="mt-5" /> */}
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;
