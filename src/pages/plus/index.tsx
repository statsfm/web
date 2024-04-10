import { Container } from '@/components/Container';
import { CrownIcon } from '@/components/Icons';
import { Image } from '@/components/Image';
import { Title } from '@/components/Title';
import { useApi, useAuth, useToaster } from '@/hooks';
import { Range } from '@/utils/statsfm';
import type { TopArtist, ItemResponse } from '@/utils/statsfm';
import clsx from 'clsx';
import { gsap, Power0, Power1 } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import type { FC, PropsWithChildren } from 'react';
import {
  useCallback,
  useMemo,
  useId,
  forwardRef,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  MdCancel,
  MdCheckCircle,
  MdDoNotDisturbAlt,
  MdOutlineDoDisturbAlt,
} from 'react-icons/md';
import type { SSRProps } from '@/utils/ssrUtils';
import { getApiInstance, fetchUser } from '@/utils/ssrUtils';
import { useMedia } from 'react-use';
import { useRouter } from 'next/router';

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
    <div ref={ref} className="absolute inset-x-0 top-48 z-10 opacity-0">
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
        'absolute bottom-10 left-1/2 z-50 flex h-min w-11/12 -translate-x-1/2 flex-row items-center justify-between rounded-xl bg-background p-2 px-4 shadow-2xl shadow-black sm:w-1/2',
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
        'absolute inset-x-0 opacity-0',
      )}
      id={id}
    >
      <h2
        className={clsx(
          sub ? '' : 'sm:mt-8',
          'mb-2 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-2xl text-transparent sm:text-5xl',
        )}
      >
        {title}
      </h2>
      <p className="text-lg">{sub}</p>
    </div>
  );
};

const PhoneScreen: FC<{ src: string; id: number; alt?: string }> = ({
  id,
  src,
  alt,
}) => {
  return (
    <img
      id={`screen${id}`}
      src={src}
      alt={alt ?? 'phone screen'}
      style={{ zIndex: id }}
      className="absolute inset-x-4 top-3 z-[34] size-[calc(100%-22px)]"
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
          <img
            key={rowKey + i}
            src="/images/screen1_framed.png"
            className="w-40"
          />
        ))}
    </div>
  );
};

const PlusScrollAnimation: FC<{ startCheckout: () => {} }> = ({
  startCheckout,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const phoneWrapperRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const snackbarRef = useRef<HTMLDivElement>(null);
  const adsBegoneBackgroundRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const q = gsap.utils.selector(boxRef);
  const mobile = useMedia('(max-width: 640px)');

  useLayoutEffect(() => {
    const phoneOffset =
      (phoneWrapperRef.current?.clientWidth ?? 0) / 2 -
      (phoneRef.current?.clientWidth ?? 0) / 2;

    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        start: 'top top',
        end: '6000px',
        trigger: boxRef.current,
        scrub: 1,
        pin: true,
      },
    });

    const startTl = gsap
      .timeline()
      .fromTo(
        phoneRef.current,
        {
          x: `${phoneOffset}px`,
        },
        { x: `0px`, duration: 2 },
      )
      .fromTo(
        snackbarRef.current,
        { y: '100px' },
        { y: '10px', ease: Power1.easeInOut },
        '<',
      );

    const endTl = gsap
      .timeline()
      .fromTo(
        snackbarRef.current,
        { y: '10px' },
        { y: '200px', ease: Power1.easeInOut },
        '<',
      );

    if (mobile || typeof window === undefined) {
      const psTl = gsap
        .timeline()
        .fromTo(q('#ps'), { opacity: 1 }, { opacity: 1 })
        // .fromTo(q('#p1'), { opacity: 0 }, { opacity: 1 }, '<')
        .to(q('#p1'), { color: '#ffd700', duration: 2 }, '<')
        .to(q('#p1'), { color: '#a3a3a3', duration: 1 })
        .fromTo(q('#p1'), { opacity: 1 }, { opacity: 0 }, '<')
        .fromTo(
          q('#p2'),
          { opacity: 0, y: 0 },
          { opacity: 1, y: '-= 100%' },
          '<',
        )
        .to(q('#p2'), { color: '#ffd700', duration: 2 }, '<')
        .fromTo(q('#screen2'), { x: '100%' }, { x: '0%', duration: 2 }, '<')
        .to(q('#p2'), { color: '#a3a3a3', duration: 1 })
        .fromTo(q('#p2'), { opacity: 1 }, { opacity: 0 }, '<')
        .fromTo(
          q('#p3'),
          { opacity: 0, y: 0 },
          { opacity: 1, y: '-= 430%' },
          '<',
        )
        .to(q('#p3'), { color: '#ffd700', duration: 2 }, '<')
        .fromTo(q('#screen3'), { x: '100%' }, { x: '0%', duration: 2 }, '<')
        .to(q('#p3'), { color: '#a3a3a3', duration: 1 })
        .fromTo(q('#ps'), { opacity: 1 }, { opacity: 0 })
        .fromTo(
          phoneRef.current,
          { x: `0px`, duration: 2 },
          {
            x: `${phoneOffset}px`,
          },
          '<',
        )
        .to(q('#hd1'), { opacity: 0 })
        .fromTo(q('#hd2'), { opacity: 0 }, { opacity: 1 }, '<')
        .fromTo(q('#screen4'), { x: '100%' }, { x: '0%' }, '<')
        .fromTo(null, {}, { duration: 2 })
        .fromTo(null, {}, {})
        .fromTo(q('#screen5'), { opacity: 0 }, { opacity: 1, duration: 6 })
        .to(q('#hd2'), { opacity: 0 }, '<')
        .fromTo(q('#hd3'), { opacity: 0 }, { opacity: 1 }, '<')
        .fromTo(
          q('#adsOverlay'),
          { opacity: 0 },
          { opacity: 1, duration: 2 },
          '<',
        );

      tl.add(startTl);
      tl.add(psTl);
      tl.add(endTl);
    } else {
      const psTl = gsap
        .timeline()
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
          '<',
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
          '<',
        )
        .fromTo(
          q('#soulmatesBg'),
          { opacity: 0.5, duration: 4 },
          { opacity: 0 },
        )
        .fromTo(q('#screen5'), { opacity: 0 }, { opacity: 1, duration: 2 }, '<')
        .to(q('#hd2'), { opacity: 0 }, '<')
        .fromTo(q('#hd3'), { opacity: 0 }, { opacity: 1 }, '<')
        .fromTo(
          q('#adsOverlay'),
          { opacity: 0 },
          { opacity: 1, duration: 2 },
          '<',
        )
        .to(
          adsBegoneBackgroundRef.current,
          {
            y: '-=16rem',
            duration: 4,
            ease: Power0.easeNone,
          },
          '<',
        )
        .fromTo(
          adsBegoneBackgroundRef.current,
          { opacity: 0, duration: 2 },
          { opacity: 0.5 },
          '<',
        )
        .fromTo(
          adsBegoneBackgroundRef.current,
          { opacity: 0.5, duration: 4 },
          { opacity: 0 },
        );

      tl.add(startTl);
      tl.add(psTl);
      tl.add(endTl);
    }

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <section
      ref={boxRef}
      className="overflow-hidden bg-foreground"
      style={{
        backgroundImage: 'radial-gradient(transparent, rgba(17, 17, 18, 0.8)',
      }}
    >
      <Container className="relative min-h-screen py-12">
        <div
          id="phoneBox"
          className="absolute inset-y-32 left-1/2 z-30 -translate-x-1/2 sm:top-48"
        >
          <div
            ref={phoneWrapperRef}
            className="flex flex-col-reverse gap-8 sm:flex-row"
          >
            <div
              ref={phoneRef}
              className="relative z-40 -mt-8 flex shrink-0 scale-90 justify-center sm:mt-0 sm:scale-100"
            >
              <div className="relative h-min w-80 overflow-hidden rounded-[48px]">
                <PhoneScreen id={5} src="/images/screen2.png" />
                <PhoneScreen id={4} src="/images/screen5.png" />
                <PhoneScreen id={3} src="/images/screen4.png" />
                <PhoneScreen id={2} src="/images/screen3.png" />
                <PhoneScreen id={1} src="/images/screen1.png" />

                <img
                  src="/images/phone_frame.png"
                  alt="bruh"
                  className="relative left-[2.5px] z-40 w-[calc(100%)]"
                />
              </div>
              <div
                id="adsOverlay"
                className="absolute left-[4px] z-50 flex h-full w-[calc(100%-2.5px)] rounded-[48px] bg-black/50 opacity-0"
              >
                <MdDoNotDisturbAlt className="mx-auto h-min w-32 self-center text-red-600" />
              </div>
            </div>
            <div
              id="ps"
              className="-mt-4 mb-8 flex h-0 shrink-0 flex-col gap-4 self-center text-center text-lg opacity-0 sm:my-0 sm:h-full sm:text-left lg:text-2xl"
            >
              <p className="m-0" id="p1">
                • view your total minutes listened
              </p>
              <p className="m-0" id="p2">
                • view 10,000 top tracks, artists and albums
              </p>
              <p className="m-0" id="p3">
                • view advanced charts
              </p>
            </div>
          </div>
        </div>

        <Snackbar ref={snackbarRef}>
          <p>Get these and even more perks available with stats.fm Plus.</p>

          <button onClick={startCheckout}>
            <p className="block shrink-0 rounded-lg bg-plus px-3 py-1.5 text-center font-medium text-black transition-colors hover:bg-plus/90 active:bg-plus/75">
              {user?.isPlus ? 'Gift Plus now!' : 'Unlock Plus now!'}
            </p>
          </button>
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
        <div
          className={clsx(mobile ? 'hidden' : 'block', 'flex flex-row gap-8')}
        >
          <SoulmateBackgroundCol amount={6} className="-mt-4" />
          <SoulmateBackgroundCol amount={7} className="-mt-48" />
          <SoulmateBackgroundCol amount={6} className="-mt-4 ml-auto" />
          <SoulmateBackgroundCol amount={7} className="-mt-48" />
        </div>
        <div
          className={clsx(
            mobile ? 'block' : 'hidden',
            'absolute left-0 top-0 size-full flex-row gap-8',
          )}
        >
          <SoulmateBackgroundCol amount={7} className="-mt-48" />
          <SoulmateBackgroundCol amount={6} className="-mt-4 ml-auto" />
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
            color === 'Yellow' || color === undefined ? 'text-plus' : '',
          )}
        />
      )}
      <p className="m-0 font-normal text-white">{perk}</p>
    </li>
  );
};

const HeaderBubbles: FC<{ topArtists: TopArtist[] }> = ({ topArtists }) => {
  const validTopArtists = useMemo(() => {
    return topArtists.filter((artist) => artist.artist.image);
  }, [topArtists]);

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
          className="absolute aspect-square animate-floating overflow-hidden rounded-full bg-gray-600 bg-cover bg-center"
        >
          {validTopArtists[i] && (
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

export const getServerSideProps: GetServerSideProps<
  SSRProps<{ topArtists: TopArtist[] }>
> = async (ctx) => {
  const { identityToken } = ctx.req.cookies;

  const api = getApiInstance(identityToken);
  const user = await fetchUser(ctx);

  let topArtists = null;
  if (user)
    topArtists = await api.users.topArtists(user.id, { range: Range.WEEKS });

  if (!topArtists || topArtists.length === 0)
    topArtists = await api.charts.topArtists({ range: Range.WEEKS });

  return {
    props: {
      user,
      topArtists,
    },
  };
};

const PlusPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ topArtists }) => {
  const api = useApi();
  const toaster = useToaster();
  const { user, login } = useAuth();
  const router = useRouter();

  const startCheckout = useCallback(async () => {
    if (!user) {
      login('/plus');
      return;
    }

    if (user.isPlus) {
      router.push('/gift');
      return;
    }

    try {
      const { item } = await api.http.get<ItemResponse<{ url: string }>>(
        `/stripe/products/spotistats_plus/prices/default/session`,
        { authRequired: true },
      );
      window.location.href = item.url;
    } catch (e) {
      toaster.error('Something went wrong');
    }
  }, [user]);

  return (
    <>
      <Title>Plus</Title>
      <Container className="relative flex flex-col justify-between gap-5 overflow-hidden pt-20 lg:flex-row">
        <div className="z-10 my-12 w-full pb-10 pt-32 sm:pb-0 md:pt-10 lg:my-28 lg:w-4/12">
          <h1 className="flex items-center text-4xl leading-none sm:text-5xl">
            Plus <CrownIcon className="ml-3 inline-block h-auto w-12" />
          </h1>
          <p className="mt-4 font-medium">
            Get full insight in your past and get the most accurate stats for
            your favorite music app today!
          </p>

          <button
            onClick={user?.isPlus ? () => router.push('/gift') : startCheckout}
            className="m-0 p-0"
          >
            <a className="mt-12 block w-fit rounded-2xl bg-plus px-5 py-3 font-bold text-black hover:bg-plus/90 active:bg-plus/75">
              {user?.isPlus ? 'Gift Plus!' : 'Unlock Plus!'}
            </a>
          </button>
        </div>
        <div className="absolute z-0 ml-auto flex items-center after:absolute after:size-full after:bg-gradient-to-tr after:from-background after:to-background/40 lg:relative lg:after:hidden">
          <HeaderBubbles topArtists={topArtists} />
        </div>
      </Container>
      <PlusScrollAnimation startCheckout={startCheckout} />
      <Container className="py-28">
        <h2 className="mb-24 w-full text-center text-4xl">Pick your tier</h2>
        <div className="flex h-min flex-row justify-center gap-10">
          <div className="hidden w-[22rem] flex-col rounded-2xl bg-foreground px-8 py-7 sm:flex">
            <div className="flex items-center">
              <h3 className="text-xl">Free</h3>
            </div>
            <p className="mb-8 mt-0 font-normal">No extra perks</p>
            <ul>
              <TierItem unchecked perk="Not Ad free" />
              <TierItem color="Gray" perk="50 Top tracks" />
              <TierItem color="Gray" perk="50 Top artists" />
              <TierItem unchecked perk="No Top albums" />
              <TierItem unchecked perk="No Import history" />
            </ul>

            <div className="mt-auto block w-full rounded-lg bg-background p-1 text-center text-white">
              You already have the free tier!
            </div>
          </div>
          <div className="w-[22rem] rounded-2xl bg-black px-8 py-7">
            <div className="flex items-center">
              <CrownIcon className="mr-1 h-4" />
              <h3 className="text-xl text-plus">Plus</h3>
            </div>
            <p className="mb-8 mt-0 font-normal">Get all our perks</p>
            <ul>
              <TierItem perk="Ad free" />
              <TierItem perk="99+ Top tracks" />
              <TierItem perk="99+ Top artists" />
              <TierItem perk="99+ Top albums" />
              <TierItem perk="Import history" />
              <li className="ml-7 mt-8">
                <p className="font-bold text-white">After import:</p>
              </li>
              <TierItem perk="Playcounts" />
              <TierItem perk="Listening clocks" />
              <TierItem perk="Advanced sort" />
              <TierItem perk="Custom timeframes" />
              <TierItem perk="And much more..." />
            </ul>
            <button
              onClick={
                user?.isPlus
                  ? () => {
                      toaster.message('You already have Plus!');
                    }
                  : startCheckout
              }
              className="m-0 w-full p-0"
            >
              <p
                className={clsx(
                  'mt-12 block w-full rounded-lg p-1 text-center font-medium',
                  user?.isPlus
                    ? 'bg-foreground text-white'
                    : 'bg-plus text-black hover:bg-plus/90 active:bg-plus/75',
                )}
              >
                {!user?.isPlus ? 'Unlock Plus now!' : 'You already have Plus!'}
              </p>
            </button>
            {user?.isPlus && (
              <button
                onClick={() => router.push('/gift')}
                className="m-0 w-full p-0"
              >
                <p className="block w-full rounded-lg bg-plus p-1 text-center font-medium text-black hover:bg-plus/90 active:bg-plus/75">
                  Gift Plus now!
                </p>
              </button>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default PlusPage;
