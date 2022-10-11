import { Container } from '@/components/Container';
import { CrownIcon } from '@/components/Icons';
import { Image } from '@/components/Image';
import { Title } from '@/components/Title';
import { useApi, useAuth } from '@/hooks';
import { Range } from '@statsfm/statsfm.js';
import type { TopArtist } from '@statsfm/statsfm.js';
import clsx from 'clsx';
import { gsap, Power0, Power1 } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import {
  useId,
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  MdCancel,
  MdCheckCircle,
  MdDoNotDisturbAlt,
  MdOutlineDoDisturbAlt,
} from 'react-icons/md';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';

// eslint-disable-next-line react/display-name
const AdsBackground = forwardRef<HTMLDivElement>((_, ref) => {
  const positions = [
    { top: 2, left: 214 },
    { top: 223, left: 94 },
    { top: 430, left: 280 },
    { top: 583, left: 83 },
    { top: 737, left: 334 },
    { top: 56, right: 215 },
    { top: 278, right: 370 },
    { top: 387, right: 120 },
    { top: 530, right: 280 },
    { top: 714, right: 380 },
  ];

  return (
    <div ref={ref} className="absolute inset-x-0 top-[12rem] z-10 opacity-0">
      <div className="flex flex-row gap-8">
        {positions.map((pos, i) => (
          <MdOutlineDoDisturbAlt
            key={`${i}ads`}
            style={{
              top: `${pos.top}px`,
              left: `${pos.left}px`,
              right: `${pos.right}px`,
            }}
            className="absolute h-min w-32 text-zinc-800"
          />
        ))}
      </div>
    </div>
  );
});

// eslint-disable-next-line react/display-name
const Snackbar = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{ className?: string }>
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        className,
        'absolute left-1/2 bottom-10 z-50 flex h-min w-1/2 -translate-x-1/2 flex-row items-center justify-between rounded-xl bg-background p-2 px-4'
      )}
    >
      {children}
    </div>
  );
});

const Heading: FC<{
  title: string;
  id: string;
  sub?: string;
  visible?: boolean;
}> = ({ title, id, sub, visible }) => {
  return (
    <div
      className={clsx(
        visible ? 'opacity-100' : 'opacity-0',
        'absolute inset-x-0 opacity-0'
      )}
      id={id}
    >
      <h2
        className={clsx(
          sub ? '' : 'mt-8',
          'mb-2 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-5xl text-transparent'
        )}
      >
        {title}
      </h2>
      <p>{sub}</p>
    </div>
  );
};

const PhoneScreen: FC<{ src: string; id: string; alt?: string }> = ({
  id,
  src,
  alt,
}) => {
  return (
    <img
      id={id}
      src={src}
      alt={alt || 'phone screen'}
      className="absolute inset-x-4 top-4 z-[34] h-[calc(100%-32px)] w-[calc(100%-32px)]"
    />
  );
};

const SoulmateBackgroundCol: FC<{ amount: number; className?: string }> = ({
  amount,
  className,
}) => {
  const rowKey = useId();

  return (
    <div className={clsx(className, 'flex flex-col gap-8')}>
      {Array(amount)
        .fill('')
        .map((_, i) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img key={rowKey + i} src="/images/app_1.webp" className="w-40" />
        ))}
    </div>
  );
};

const PlusScrollAnimation: FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const phoneWrapperRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const snackbarRef = useRef<HTMLDivElement>(null);
  const adsBegoneBackgroundRef = useRef<HTMLDivElement>(null);

  const q = gsap.utils.selector(boxRef);

  useLayoutEffect(() => {
    const phoneOffset =
      (phoneWrapperRef.current?.clientWidth ?? 0) / 2 -
      (phoneRef.current?.clientWidth ?? 0) / 2;

    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        start: 'top top',
        end: '8000px',
        trigger: boxRef.current,
        scrub: 1,
        pin: true,
      },
    });

    tl.fromTo(
      phoneRef.current,
      {
        x: `${phoneOffset}px`,
      },
      { x: `0px`, duration: 2 }
    )
      .fromTo(
        snackbarRef.current,
        { y: '100px' },
        { y: '10px', ease: Power1.easeInOut },
        '<'
      )
      .fromTo(q('#ps'), { opacity: 0 }, { opacity: 1 }, '<')
      .to(q('#p1'), { color: '#ffd700', duration: 2 })
      .to(q('#p1'), { color: '#a3a3a3', duration: 1 })
      .fromTo(q('#screen2'), { x: '100%' }, { x: '0%', duration: 2 }, '<')
      .to(q('#p2'), { color: '#ffd700', duration: 2 })
      .to(q('#p2'), { color: '#a3a3a3', duration: 1 })
      .fromTo(q('#screen3'), { x: '100%' }, { x: '0%', duration: 2 }, '<')
      .to(q('#p3'), { color: '#ffd700', duration: 2 })
      .to(q('#p3'), { color: '#a3a3a3', duration: 1 })
      .fromTo(q('#ps'), { opacity: 1 }, { opacity: 0 })
      .fromTo(
        phoneRef.current,
        { x: `0px`, duration: 2 },
        {
          x: `${phoneOffset}px`,
        },
        '<'
      )
      .to(q('#hd1'), { opacity: 0 })
      .fromTo(q('#hd2'), { opacity: 0 }, { opacity: 1 }, '<')
      .fromTo(q('#screen4'), { x: '100%' }, { x: '0%', duration: 2 }, '<')
      .to(q('#soulmatesBg'), {
        y: '-=60rem',
        duration: 4,
        ease: Power0.easeNone,
      })
      .fromTo(
        q('#soulmatesBg'),
        { opacity: 0, duration: 2 },
        { opacity: 0.5 },
        '<'
      )
      .fromTo(q('#soulmatesBg'), { opacity: 0.5, duration: 4 }, { opacity: 0 })
      .fromTo(q('#screen5'), { opacity: 0 }, { opacity: 1, duration: 2 }, '<')
      .to(q('#hd2'), { opacity: 0 }, '<')
      .fromTo(q('#hd3'), { opacity: 0 }, { opacity: 1 }, '<')
      .fromTo(
        q('#adsOverlay'),
        { opacity: 0 },
        { opacity: 1, duration: 2 },
        '<'
      )
      .to(
        adsBegoneBackgroundRef.current,
        {
          y: '-=16rem',
          duration: 4,
          ease: Power0.easeNone,
        },
        '<'
      )
      .fromTo(
        adsBegoneBackgroundRef.current,
        { opacity: 0, duration: 2 },
        { opacity: 0.5 },
        '<'
      )
      .fromTo(
        adsBegoneBackgroundRef.current,
        { opacity: 0.5, duration: 4 },
        { opacity: 0 }
      )
      .fromTo(
        snackbarRef.current,
        { y: '10px' },
        { y: '100px', ease: Power1.easeInOut },
        '<'
      );

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <section ref={boxRef} className="overflow-hidden bg-foreground">
      <Container className="relative min-h-screen py-12">
        <div
          id="phoneBox"
          className="absolute top-48 bottom-32 left-1/2 z-30 -translate-x-1/2"
        >
          <div ref={phoneWrapperRef} className="flex flex-row gap-8">
            <div
              ref={phoneRef}
              className="relative z-40 flex shrink-0 justify-center"
            >
              <div className="relative h-min w-80 overflow-hidden rounded-[52px]">
                <PhoneScreen id="screen5" src="/images/screen1.png" />
                <PhoneScreen id="screen4" src="/images/screen3.png" />
                <PhoneScreen id="screen3" src="/images/screen3.png" />
                <PhoneScreen id="screen2" src="/images/screen2.png" />
                <PhoneScreen id="screen1" src="/images/screen1.png" />

                <img
                  src="/images/phone_frame.png"
                  alt="bruh"
                  className="relative left-[2px] z-40"
                />
              </div>
              <div
                id="adsOverlay"
                className="absolute top-0 left-0 z-50 flex h-full w-full rounded-[56px] bg-black/50 opacity-0"
              >
                <MdDoNotDisturbAlt className="mx-auto h-min w-32 self-center text-red-600" />
              </div>
            </div>
            <div
              id="ps"
              className="flex h-full shrink-0 flex-col gap-4 self-center text-lg opacity-0"
            >
              <p className="m-0" id="p1">
                view your total minutes listened
              </p>
              <p className="m-0" id="p2">
                view 10,000 top tracks, artists and albums
              </p>
              <p className="m-0" id="p3">
                view advanced charts
              </p>
            </div>
          </div>
        </div>

        <Snackbar ref={snackbarRef}>
          <p>Get these and even more perks available with plus.</p>
          <Link href="/gift">
            <a className="block rounded-lg bg-plus/80 px-3 py-1.5 text-center font-medium text-black transition-colors hover:bg-plus/90 active:bg-plus/75">
              Get stats.fm plus!
            </a>
          </Link>
        </Snackbar>

        <div className="relative inset-0 z-20 w-full text-center">
          <Heading title="Import your history and &hellip;" id="hd1" visible />
          <Heading
            title="Find your soulmate"
            sub="get unlimited soulmates, experience music together"
            id="hd2"
          />
          <Heading
            title="No more ads"
            sub="Never be bothered again while looking at your stats"
            id="hd3"
          />
        </div>
      </Container>

      <AdsBackground ref={adsBegoneBackgroundRef} />
      <div id="soulmatesBg" className="absolute inset-x-0 top-0 z-10 opacity-0">
        <div className="absolute inset-y-0 right-0 h-full w-1/2 bg-gradient-to-l from-black/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 h-full w-1/2 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="flex flex-row gap-8">
          <SoulmateBackgroundCol amount={6} className="-mt-4" />
          <SoulmateBackgroundCol amount={7} className="-mt-48" />
          <SoulmateBackgroundCol amount={6} className="ml-auto -mt-4" />
          <SoulmateBackgroundCol amount={7} className="-mt-48" />
        </div>
      </div>
    </section>
  );
};

const TierItem: FC<{
  perk: string;
  unchecked?: boolean;
  color?: 'Yellow' | 'Gray';
}> = ({ perk, color, unchecked }) => {
  return (
    <li className="mt-2 flex items-center">
      {unchecked ? (
        <MdCancel className="mr-2 text-red-500" />
      ) : (
        <MdCheckCircle
          className={clsx(
            'mr-2',
            color === 'Yellow' || color === undefined ? 'text-plus' : ''
          )}
        />
      )}
      <p className="m-0 font-normal text-white">{perk}</p>
    </li>
  );
};

const HeaderBubbles: FC<{ topArtists: TopArtist[] }> = ({ topArtists }) => {
  const bubbles: Array<Record<'top' | 'left' | 's', number>> = [
    { top: 104, left: 0, s: 164 },
    { top: 23, left: 176, s: 135 },
    { top: 233, left: 285, s: 110 },
    { top: 115, left: 340, s: 100 },
    { top: 195, left: 465, s: 90 },
    { top: 0, left: 360, s: 80 },
    { top: 186, left: 189, s: 75 },
    { top: 21, left: 76, s: 60 },
    { top: 61, left: 450, s: 60 },
    { top: 275, left: 116, s: 60 },
  ];

  return (
    <ul className="relative h-[350px] w-[555px]">
      {bubbles.map((bubble, i) => (
        <li
          key={i}
          style={{
            ...bubble,
            height: bubble.s,
            width: bubble.s,
            animationDelay: `${i % 6}s`,
          }}
          className="absolute animate-floating rounded-full bg-gray-600 bg-cover bg-center"
        >
          {topArtists[i] && (
            <Image
              alt="Top artist"
              className="!rounded-full !bg-gray-600"
              src={topArtists[i]?.artist.image ?? ''}
              width={bubble.s}
              height={bubble.s}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const PlusPage: NextPage = () => {
  const api = useApi();
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api.users.topArtists(user.id, { range: Range.WEEKS }).then((res) => {
        setTopArtists(res);
      });
    } else {
      api.charts.topArtists({ range: Range.WEEKS }).then((res) => {
        setTopArtists(res);
      });
    }
  }, [user]);

  return (
    <>
      <Title>Plus</Title>
      <Container className="flex flex-col justify-between gap-5 pt-20 lg:flex-row">
        <div className="my-12 w-full pt-10 lg:my-28 lg:w-4/12">
          <h1 className="flex items-center text-5xl leading-none">
            stats.fm Plus{' '}
            <CrownIcon className="ml-3 inline-block h-auto w-12" />
          </h1>
          <p className="mt-4 font-medium">
            Get full insight in your past and get the most accurate stats for
            your favorite music app today!
          </p>

          <Link href="/gift">
            <a className="mt-12 block w-fit rounded-2xl bg-plus px-5 py-3 font-bold text-black hover:bg-plus/90 active:bg-plus/75">
              Get stats.fm plus!
            </a>
          </Link>
        </div>
        <div className="ml-auto flex items-center">
          <HeaderBubbles topArtists={topArtists} />
        </div>
      </Container>
      <PlusScrollAnimation />
      <Container className="py-28">
        <h2 className="mb-24 w-full text-center text-4xl">Pick your tier</h2>
        <div className="flex h-min justify-center gap-10">
          <div className="flex w-[22rem] flex-col rounded-2xl bg-foreground py-7 px-8">
            <div className="flex items-center">
              <h3 className="text-xl">Free</h3>
            </div>
            <p className="mt-0 mb-8 font-normal">No extra perks</p>
            <ul>
              <TierItem unchecked perk="Not Ad free" />
              <TierItem color="Gray" perk="50 Top tracks" />
              <TierItem color="Gray" perk="50 Top artists" />
              <TierItem unchecked perk="No Top albums" />
              <TierItem unchecked perk="No Import history" />
            </ul>

            <div className="mt-auto block w-full rounded-lg bg-background py-1 text-center text-white ">
              You already have free tier.
            </div>
          </div>
          <div className="w-[22rem] rounded-2xl bg-black py-7 px-8">
            <div className="flex items-center">
              <CrownIcon className="mr-1 h-4" />
              <h3 className="text-xl text-plus">Plus</h3>
            </div>
            <p className="mt-0 mb-8 font-normal">Get all our perks</p>
            <ul>
              <TierItem perk="Ad free" />
              <TierItem perk="99+ Top tracks" />
              <TierItem perk="99+ Top artists" />
              <TierItem perk="99+ Top albums" />
              <TierItem perk="Import history" />
              <li className="mt-8 ml-7">
                <p className="font-bold text-white">After import:</p>
              </li>
              <TierItem perk="Playcounts" />
              <TierItem perk="Listening clocks" />
              <TierItem perk="Advanced sort" />
              <TierItem perk="Custom timeframes" />
              <TierItem perk="And much more..." />
            </ul>
            <Link href="/gift">
              <a className="mt-12 block w-full rounded-lg bg-plus py-1 text-center font-medium text-black hover:bg-plus/90 active:bg-plus/75">
                Get stats.fm plus!
              </a>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PlusPage;
