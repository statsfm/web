import { Container } from '@/components/Container';
import { CrownIcon } from '@/components/CrownIcon';
import { Title } from '@/components/Title';
import Link from 'next/link';
import type { FC } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { gsap, Power0 } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import {
  MdCancel,
  MdCheckCircle,
  MdDoNotDisturbAlt,
  MdOutlineDoDisturbAlt,
} from 'react-icons/md';
import clsx from 'clsx';

const PlusScrollAnimation: FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const q = gsap.utils.selector(boxRef);
  const psRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        start: 'top top',
        end: '6000px',
        trigger: boxRef.current,
        scrub: 1,
        markers: true,
        pin: true,
      },
    });

    tl.fromTo(
      q('#phone'),
      { x: `${(psRef.current?.clientWidth ?? 0) / 2}px` },
      { x: `0px`, duration: 2 }
    )
      .fromTo(q('#ps'), { opacity: 0 }, { opacity: 1 }, '<')
      .to(q('#p1'), { color: '#ffd700', duration: 2 })
      .to(q('#p1'), { color: '#a3a3a3', duration: 1 })
      .to(q('#p2'), { color: '#ffd700', duration: 2 })
      .to(q('#p2'), { color: '#a3a3a3', duration: 1 })
      .to(q('#p3'), { color: '#ffd700', duration: 2 })
      .to(q('#p3'), { color: '#a3a3a3', duration: 1 })
      .fromTo(q('#ps'), { opacity: 1 }, { opacity: 0 })
      .fromTo(
        q('#phone'),
        { x: `0px`, duration: 2 },
        { x: `${(psRef.current?.clientWidth ?? 0) / 2}px` },
        '<'
      )
      .to(q('#hd1'), { opacity: 0 })
      .fromTo(q('#hd2'), { opacity: 0 }, { opacity: 1 }, '<')
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
      .to(q('#hd2'), { opacity: 0 }, '<')
      .fromTo(q('#hd3'), { opacity: 0 }, { opacity: 1 }, '<')
      .fromTo(
        q('#adsOverlay'),
        { opacity: 0 },
        { opacity: 1, duration: 2 },
        '<'
      )
      .to(
        q('#adsBegoneBg'),
        {
          y: '-=16rem',
          duration: 4,
          ease: Power0.easeNone,
        },
        '<'
      )
      .fromTo(
        q('#adsBegoneBg'),
        { opacity: 0, duration: 2 },
        { opacity: 0.5 },
        '<'
      )
      .fromTo(q('#adsBegoneBg'), { opacity: 0.5, duration: 4 }, { opacity: 0 });

    return () => {
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <section ref={boxRef} className="overflow-hidden bg-foreground">
      <Container className="relative min-h-screen py-20">
        <div
          id="phoneBox"
          className="absolute top-56 bottom-32 left-1/2 z-30 -translate-x-1/2"
        >
          <div className="flex flex-row gap-8">
            <div id="phone" className="relative flex shrink-0 justify-center">
              <div className="relative z-40 h-min w-80">
                <img
                  src="/images/screen1.png"
                  alt="bruh"
                  className="absolute inset-x-4 top-4 z-[39] h-[calc(100%-32px)] w-[calc(100%-32px)]"
                />
                <img
                  src="/images/phone_frame.png"
                  alt="bruh"
                  className="relative z-40"
                />
              </div>
              <div
                id="adsOverlay"
                className="absolute top-0 left-0 z-50 flex h-full w-full rounded-[56px] bg-black/50"
              >
                <MdDoNotDisturbAlt className="mx-auto h-min w-32 self-center text-red-600" />
              </div>
            </div>
            <div
              id="ps"
              ref={psRef}
              className="flex h-full shrink-0 flex-col gap-4 self-center text-lg"
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
        <div className="relative inset-0 z-20 w-full text-center">
          <div className="absolute inset-x-0" id="hd1">
            <h2 className="mt-8 mb-2 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-5xl text-transparent">
              Import your history and &hellip;
            </h2>
          </div>
          <div className="absolute inset-x-0" id="hd2">
            <h2 className=" mb-2 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-5xl text-transparent">
              Find your soulmate
            </h2>
            <p>get unlimited soulmates, experience music together</p>
          </div>
          <div className="absolute inset-x-0" id="hd3">
            <h2 className=" mb-2 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-5xl text-transparent">
              No more ads
            </h2>
            <p>Never be bothered again while looking at your stats</p>
          </div>
        </div>
      </Container>
      <div id="adsBegoneBg" className="absolute inset-x-0 top-[12rem] z-10">
        <div className="flex flex-row gap-8">
          <MdOutlineDoDisturbAlt className="absolute top-[2px] left-[214px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[223px] left-[94px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[430px] left-[280px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[583px] left-[83px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[737px] left-[334px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[56px] right-[215px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[278px] right-[370px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[387px] right-[120px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[530px] right-[280px] h-min w-32 text-zinc-800" />
          <MdOutlineDoDisturbAlt className="absolute top-[714px] right-[380px] h-min w-32 text-zinc-800" />
        </div>
      </div>

      <div
        id="soulmatesBg"
        className="absolute inset-x-0 top-0 z-10 opacity-40"
      >
        <div className="absolute inset-y-0 right-0 h-full w-1/2 bg-gradient-to-l from-black/50 to-transparent" />
        <div className="absolute inset-y-0 left-0 h-full w-1/2 bg-gradient-to-r from-black/50 to-transparent" />
        <div className="flex flex-row gap-8">
          <div className="-mt-4 flex flex-col gap-8">
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
          </div>
          <div className="-mt-48 flex flex-col gap-8">
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
          </div>

          <div className="ml-auto -mt-4 flex flex-col gap-8">
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
          </div>
          <div className="-mt-48 flex flex-col gap-8">
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
            <img src="/images/app_1.webp" alt="" className="w-40" />
          </div>
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

const PlusPage = () => {
  return (
    <>
      <Title>plus</Title>
      <Container className="flex flex-col justify-between gap-5 pt-20 lg:flex-row">
        <div className="my-12 w-full pt-10 lg:my-28 lg:w-4/12">
          <h1 className="flex items-center text-5xl leading-none">
            Stats.fm Plus{' '}
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
