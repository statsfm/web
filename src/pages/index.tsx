import { ChevronLink } from '@/components/ChevronLink';
import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import { TotalStats } from '@/components/Home/TotalStats';
import { StoreBadge } from '@/components/StoreBadges';
import clsx from 'clsx';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';
import {
  MdFormatListBulleted,
  MdHistory,
  MdLock,
  MdShowChart,
} from 'react-icons/md';

const Card: FC<PropsWithChildren<{ className?: string }>> = (props) => {
  return (
    <div
      className={clsx(
        'max-h-max w-full rounded-2xl bg-bodySecundary p-5',
        props.className
      )}
    >
      {props.children}
    </div>
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
        <h2 className="text-2xl font-bold leading-8">{title}</h2>
        <p className="text-neutral-400">{children}</p>
      </div>
    </div>
  );
};

const PhoneAppDisplay: FC = () => (
  <img
    src="/images/app_1.webp"
    className="w-full transition-transform duration-200 hover:scale-[1.02]"
    alt="phone app"
  />
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Stats.fm</title>
      </Head>
      <Container className="flex flex-col justify-between gap-5 pt-20 lg:flex-row">
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
            <h1 className="leading-10">Easy, extensive and secure</h1>
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
            <TotalStats />
          </div>
        </Container>
      </section>
      <Container className="py-14">
        <Card className="flex flex-col justify-between overflow-hidden p-0 md:max-h-[365px] md:flex-row md:gap-5">
          <div className="flex w-full flex-col justify-start p-5 md:w-8/12 md:p-10">
            <h1>Connect with your friends</h1>
            <p className="text-xl font-normal">
              It&apos;s as easy as sharing a link to your profile to share your
              stats with friends.
              <br />
              <br />
              Send friend requests to your friends and if your friends&apos;
              privacy settings allow it you&apos;ll be able to check their stats
              anytime.
            </p>
            <div className="h-full"></div>

            <ChevronLink href="sjoerdgaatwakawaka" local>
              Check out an example page
            </ChevronLink>
          </div>
          <div className="hidden w-[500px] min-w-[350px] translate-x-[75px] gap-3 overflow-hidden md:flex">
            <div className="flex w-6/12 translate-y-[-300px] flex-col gap-5">
              <PhoneAppDisplay />
              <PhoneAppDisplay />
            </div>
            <div className="flex w-6/12 translate-y-[-150px] flex-col gap-5">
              <PhoneAppDisplay />
              <PhoneAppDisplay />
            </div>
          </div>
          <div className="flex max-h-96 justify-center overflow-hidden px-5 md:hidden">
            <img src="/images/app_1.webp" className="h-full" alt="app" />
          </div>
        </Card>
        <div className="mt-10 flex max-h-[575px] gap-10 md:max-h-[365px]">
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="w-[500px] min-w-[350px] translate-x-[35px] gap-3 md:flex">
              <div className="flex w-6/12 translate-y-[-300px] flex-col gap-5">
                <PhoneAppDisplay />
                <PhoneAppDisplay />
              </div>
              <div className="flex w-6/12 translate-y-[-190px] flex-col gap-5">
                <PhoneAppDisplay />
                <PhoneAppDisplay />
              </div>
            </div>
            <div className="flex justify-center px-5 md:hidden">
              <img src="/images/app_1.webp" alt="app" />
            </div>
          </Card>
          <Card className="max-h-[575px] p-5 md:max-h-[365px] md:p-10">
            <div className="flex w-full flex-col justify-start">
              <h1>Full control over your data</h1>
              <p className="text-xl font-normal">
                Don&apos;t want to share part of your stats/profile? Use the
                privacy settings to select which parts of your profile you want
                to share with others.
                <br />
                <br />
                Want me to delete all your data? No problem, you can do that
                anytime in your privacy settings.
              </p>
            </div>
          </Card>
        </div>
      </Container>
      <section className="bg-bodySecundary py-14 text-[black]">
        <Container>
          <Card className="flex flex-col items-center !bg-primary px-6 py-10 text-center transition-transform duration-200 hover:scale-[1.02] sm:px-12 sm:py-20">
            <h1 className="text-bodySecundary">
              Download today and start your journey
            </h1>
            <h4 className="py-2 text-bodySecundary">
              Available on Android & iOS
            </h4>
            <div className="mt-8 flex flex-col items-center justify-center gap-2 md:flex-row">
              <StoreBadge store="google" />
              <StoreBadge store="apple" />
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default Home;