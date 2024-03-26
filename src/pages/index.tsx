import { Card } from '@/components/Card';
import { ChevronLink } from '@/components/ChevronLink';
import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { TotalStats } from '@/components/Home/TotalStats';
import { StoreBadge } from '@/components/StoreBadges';
import { Title } from '@/components/Title';
import { useScrollPercentage } from '@/hooks/use-scroll-percentage';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { event } from 'nextjs-google-analytics';
import type { FC, PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';
import {
  MdFormatListBulleted,
  MdHistory,
  MdLock,
  MdShowChart,
} from 'react-icons/md';

const FeatureItem: FC<PropsWithChildren<{ title: string; Icon: IconType }>> = ({
  title,
  Icon,
  children,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="grid aspect-square min-w-12 place-items-center rounded-full bg-primaryLighter text-xl font-bold text-primary">
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

// TODO: fix easylist blocking this
// https://github.dev/easylist/easylist/blob/d91346100f3faa32c25b194a1a8afbc9eff12049/easyprivacy/easyprivacy_general.txt#L5412
// ssr works but client side props get blocked by this filter

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const Home: NextPage = () => {
  useScrollPercentage(30, () => event('HOME_scroll_30'));
  return (
    <>
      <Title reverse noDivider>
        (Formerly Spotistats for Spotify)
      </Title>
      <Container className="flex flex-col justify-between gap-5 pt-20 lg:flex-row">
        <div className="my-12 w-full pt-10 lg:my-28 lg:w-5/12">
          <h1 className="text-5xl leading-none">
            <span className="font-extrabold text-white hover:text-primary hover:opacity-100">
              Your
            </span>{' '}
            music,
            <br />
            <span className="font-extrabold opacity-30 hover:text-primary hover:opacity-100">
              your
            </span>{' '}
            stats,
            <br />
            <span className="font-extrabold opacity-30 hover:text-primary hover:opacity-100">
              your
            </span>{' '}
            story.
          </h1>
          <p className="mb-5">
            Enter a new dimension of music by getting unique insights into your
            music taste.
          </p>
          <ChevronLink
            href="https://youtu.be/ABqhwEmR7E0"
            onClick={() => event('HOME_header_watch_video_new')}
          >
            Watch the video
          </ChevronLink>
          <div className="mt-8 flex flex-col items-center gap-2 md:flex-row">
            <StoreBadge
              store="apple"
              onClick={() => {
                event('HOME_header_appstore');
              }}
            />
            <StoreBadge
              store="google"
              onClick={() => {
                event('HOME_header_playstore');
              }}
            />
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
      <section className="-mt-10 bg-foreground py-28">
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
            <div className="mb-8 mt-5 flex flex-col gap-3">
              <FeatureItem Icon={MdLock} title="Safe & secure">
                Privacy is key, and I&apos;ve built the platform keeping
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
                streaming history and unlock the full potential of the platform
                by getting access to lots of cool features. It&apos;s really
                cool, I promise : )
              </FeatureItem>
              <p>
                *{' '}
                <Link legacyBehavior href="import">
                  <a
                    className="text-white hover:opacity-80"
                    onClick={() => {
                      event('HOME_features_import_link');
                    }}
                  >
                    import of streaming history
                  </a>
                </Link>{' '}
                may be required to unlock (part of) this feature
              </p>
            </div>
            <Divider invert className="border-neutral-600" />
            <ErrorBoundary
              fallback={
                <div className="flex h-72 w-full items-center justify-center text-neutral-400">
                  Total stats currently unavailable
                </div>
              }
            >
              <TotalStats />
            </ErrorBoundary>
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

            <ChevronLink
              onClick={() => event('HOME_friends_example_page')}
              href="sjoerdgaatwakawaka"
              local
            >
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
                Want us to delete all your data? No problem, you can do that
                anytime in your account settings.
              </p>
            </div>
          </Card>
        </div>
      </Container>
      <section className="bg-foreground py-14 text-[black]">
        <Container>
          <Card className="flex flex-col items-center !bg-primary px-6 py-10 text-center transition-transform duration-200 hover:scale-[1.02] sm:px-12 sm:py-20">
            <h1 className="text-foreground">
              Download today and start your journey
            </h1>
            <h4 className="py-2 text-foreground">Available on Android & iOS</h4>
            <div className="mt-8 flex flex-col items-center justify-center gap-2 md:flex-row">
              <StoreBadge
                store="google"
                onClick={() => event('HOME_cta_appstore')}
              />
              <StoreBadge
                store="apple"
                onClick={() => event('HOME_cta_playstore')}
              />
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
};

export default Home;
