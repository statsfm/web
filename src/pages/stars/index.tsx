/* eslint-disable no-nested-ternary */
import { Title } from '@/components/Title';
import type { NextPage } from 'next';
import type { FC, PropsWithChildren } from 'react';
import type { IconType } from 'react-icons';
import {
  MdLock,
  MdShowChart,
  MdFormatListBulleted,
  MdHistory,
} from 'react-icons/md';

// const steps = [
//   {
//     name: 'Create account',
//     description: 'Vitae sed mi luctus laoreet.',
//     href: '#',
//     status: 'complete',
//   },
//   {
//     name: 'Profile information',
//     description: 'Cursus semper viverra facilisis et et some more.',
//     href: '#',
//     status: 'current',
//   },
//   {
//     name: 'Business information',
//     description: 'Penatibus eu quis ante.',
//     href: '#',
//     status: 'upcoming',
//   },
//   {
//     name: 'Theme',
//     description: 'Faucibus nec enim leo et.',
//     href: '#',
//     status: 'upcoming',
//   },
//   {
//     name: 'Preview',
//     description: 'Iusto et officia maiores porro ad non quas.',
//     href: '#',
//     status: 'upcoming',
//   },
// ];

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
        <p className="text-gray-500">{children}</p>
      </div>
    </div>
  );
};

const firstStats = [
  { label: 'Users', value: '7.5M+' },
  { label: 'Daily streams', value: '25M+' },
];
const secondStats = [
  { label: 'Started2', value: '2021' },
  { label: 'Streams2', value: '50M+' },
  { label: 'Royalties2', value: '$150K+' },
  { label: 'Charts2', value: '100+' },
];
const Stars: NextPage = () => {
  // useScrollPercentage(30, () => event('HOME_scroll_30'));
  return (
    <>
      <Title reverse noDivider>
        (Revolutionary music distrubition)
      </Title>
      <div className="pt-[6rem]">
        {/* TODO die padding hierboven */}
        <div className="">
          <main>
            {/* Hero section */}
            <div className="relative">
              {/* <div className="absolute inset-x-0 bottom-0 h-1/2 bg-background" /> */}
              <div className="mx-auto max-w-7xl">
                {/* sm:px-6 lg:px-8 */}
                <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                  <div className="absolute inset-0">
                    <img
                      className="h-full w-full object-cover"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063218663731253268/austin-neill-hgO1wFPXl3I-unsplash_copy.jpg"
                      alt="Artist performing"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-700 mix-blend-multiply" /> */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-600 mix-blend-multiply" />
                  </div>
                  <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                    <h1 className="text-center text-4xl font-extrabold leading-[2.5rem] sm:text-5xl md:leading-[3.2rem] lg:text-6xl lg:leading-[3.8rem]">
                      <span className=" text-white">Music distribution</span>
                      <br />
                      <span className=" text-green-200">like never before</span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-lg text-center text-xl font-medium text-green-200 sm:max-w-3xl">
                      Join our international distribution label and take your
                      music career to the next level
                    </p>
                    <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                      <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-xl border border-transparent bg-white px-4 py-3 text-base font-medium text-green-700 shadow-sm hover:bg-green-50 sm:px-8"
                        >
                          Sign up
                        </a>
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-xl border border-transparent bg-green-600/60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-600/70 sm:px-8"
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Cloud */}
            <div className="">
              <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold uppercase tracking-wide ">
                  Partnered with the biggest names in the industry
                </p>
                <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216967156252702/spotify.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216964786471022/apple.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216968125136947/tiktok.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216968586514462/youtube.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216964224438456/amazon.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216966103486565/instagram.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216965679845537/facebook.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216966610980914/soundcloud.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216967621808188/tidal.png"
                      alt="todo"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center px-2 md:col-span-2 lg:col-span-1">
                    <img
                      className="streaming-service-icon h-8 w-auto object-contain"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063216965323346011/deezer.png"
                      alt="todo"
                    />
                  </div>
                  {/* <div className="col-span-1 flex justify-center md:col-span-2 md:col-start-2 lg:col-span-1">
                  <img
                    className="h-12"
                    src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
                    alt="Transistor"
                  />
                </div>
                <div className="col-span-2 flex justify-center md:col-span-2 md:col-start-4 lg:col-span-1">
                  <img
                    className="h-12"
                    src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
                    alt="Workcation"
                  />
                </div> */}
                </div>
                {/* <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
                <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                  <img
                    className="h-12"
                    src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg"
                    alt="Tuple"
                  />
                </div>
                <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                  <img
                    className="h-12"
                    src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg"
                    alt="Mirage"
                  />
                </div>
                <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                  <img
                    className="h-12"
                    src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg"
                    alt="StaticKit"
                  />
                </div>
                <div className="col-span-1 flex justify-center md:col-span-2 md:col-start-2 lg:col-span-1">
                  <img
                    className="h-12"
                    src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg"
                    alt="Transistor"
                  />
                </div>
                <div className="col-span-2 flex justify-center md:col-span-2 md:col-start-4 lg:col-span-1">
                  <img
                    className="h-12"
                    src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg"
                    alt="Workcation"
                  />
                </div>
              </div> */}
              </div>
            </div>

            <div className="relative py-16 sm:py-24">
              <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24 lg:px-8">
                <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
                  {/* Content area */}
                  <div className="pt-12 sm:pt-16 lg:pt-20">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      Get free promotion to a huge audience
                    </h2>
                    <div className="mt-3 space-y-4 text-gray-500">
                      <p className="text-lg">
                        Sagittis scelerisque nulla cursus in enim consectetur
                        quam. Dictum urna sed consectetur neque tristique
                        pellentesque.
                      </p>
                      <p className="text-base leading-7">
                        Sollicitudin tristique eros erat odio sed vitae,
                        consequat turpis elementum. Lorem nibh vel, eget pretium
                        arcu vitae. Eros eu viverra donec ut volutpat donec
                        laoreet quam urna.
                      </p>
                      {/* <p className="text-base leading-7">
                        Rhoncus nisl, libero egestas diam fermentum dui. At quis
                        tincidunt vel ultricies. Vulputate aliquet velit
                        faucibus semper. Pellentesque in venenatis vestibulum
                        consectetur nibh id. In id ut tempus egestas. Enim sit
                        aliquam nec, a. Morbi enim fermentum lacus in. Viverra.
                      </p> */}
                    </div>
                  </div>

                  {/* Stats section */}
                  <div className="mt-3">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-0">
                      {firstStats.map((stat) => (
                        <div key={stat.label} className="pt-6">
                          <dt className="text-base font-medium text-gray-400">
                            {stat.label}
                          </dt>
                          <dd className="text-3xl font-extrabold tracking-tight text-white">
                            {stat.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-10">
                      <a
                        href="https://stats.fm"
                        target={'_blank'}
                        className="text-base font-medium text-green-500"
                        rel="noreferrer"
                      >
                        {' '}
                        Learn more about stats.fm{' '}
                        <span aria-hidden="true">&rarr;</span>{' '}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="relative top-3 sm:py-16 lg:py-0">
                  <div
                    aria-hidden="true"
                    className="hidden sm:block lg:absolute lg:inset-y-0 lg:left-0 lg:w-screen"
                  >
                    <div className="absolute inset-y-0 left-1/2 w-full rounded-l-3xl bg-foreground lg:left-72" />
                    {/* <svg
                      className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                      width={404}
                      height={392}
                      fill="none"
                      viewBox="0 0 404 392"
                    >
                      <defs>
                        <pattern
                          id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                          x={0}
                          y={0}
                          width={20}
                          height={20}
                          patternUnits="userSpaceOnUse"
                        >
                          <rect
                            x={0}
                            y={0}
                            width={4}
                            height={4}
                            className="text-gray-200"
                            fill="currentColor"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width={404}
                        height={392}
                        fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
                      />
                    </svg> */}
                  </div>
                  <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:px-0 lg:py-20">
                    {/* Testimonial card */}
                    <div className="relative overflow-hidden rounded-2xl pt-72 pb-4 shadow-xl">
                      <div className="inset-0 my-5 w-full py-10"></div>
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://media.discordapp.net/attachments/858019685119295488/1063597634859827340/deskpromo_copy.webp"
                        alt=""
                      />
                    </div>
                    <div className="hidden">
                      <div className="absolute inset-0 bg-transparent mix-blend-multiply" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 opacity-90" />
                      <div className="relative px-8">
                        {/* <div>
                          <img
                            className="h-12"
                            src="https://tailwindui.com/img/logos/workcation.svg?color=white"
                            alt="Workcation"
                          />
                        </div> */}
                        <blockquote className="mt-8">
                          <div className="relative text-lg font-medium text-white md:grow">
                            <svg
                              className="absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 text-stone-400"
                              fill="currentColor"
                              viewBox="0 0 32 32"
                              aria-hidden="true"
                            >
                              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                            </svg>
                            <p className="relative font-medium text-white">
                              Tincidunt integer commodo, cursus etiam aliquam
                              neque, et. Consectetur pretium in volutpat, diam.
                              Montes, magna cursus nulla feugiat dignissim id
                              lobortis amet.
                            </p>
                          </div>

                          <footer className="mt-4">
                            <p className="text-base font-bold text-neutral-300">
                              Johnny Doe, singer songwriter
                            </p>
                          </footer>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 sm:pt-10">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                  <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                    {/* Get free promotion to a huge audience */}A fair share
                  </h2>
                  <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Repellendus repellat laudantium.
                  </p>
                </div>
              </div>
              <div className="mt-10 pb-12 sm:pb-16">
                <div className="relative">
                  <div className="absolute inset-0 h-1/2" />
                  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                      <dl className="grid-cols-6 rounded-2xl bg-foreground shadow-lg sm:grid">
                        <div className="col-span-4 flex flex-col border-b border-background p-6 text-center sm:border-0 sm:border-r">
                          <dt className="order-2 mb-2 text-lg font-medium leading-6 text-gray-400">
                            for you
                          </dt>
                          <dd className="order-1 text-5xl font-extrabold text-primary">
                            80%
                          </dd>
                        </div>
                        <div className="flex flex-col border-t border-background p-6 text-center sm:border-0 sm:border-x">
                          <dt className="order-2 mb-2 text-lg font-medium leading-6 text-gray-400">
                            management
                          </dt>
                          <dd className="order-1 text-5xl font-extrabold text-white">
                            10%
                          </dd>
                        </div>
                        <div className="flex flex-col border-t border-background p-6 text-center sm:border-0 sm:border-l">
                          <dt className="order-2 mb-2 text-lg font-medium leading-6 text-gray-400">
                            marketing
                          </dt>
                          <dd className="order-1 text-5xl font-extrabold text-white">
                            10%
                          </dd>
                        </div>
                        {/* <div className="flex flex-col border-b border-background p-6 text-center sm:border-0 sm:border-r">
                          <dt className="order-2 mb-2 text-lg font-medium leading-6 text-gray-400">
                            app users
                          </dt>
                          <dd className="order-1 text-5xl font-extrabold text-primary">
                            7.5M+
                          </dd>
                        </div>
                        <div className="flex flex-col border-y border-background p-6 text-center sm:border-0 sm:border-x">
                          <dt className="order-2 mb-2 text-lg font-medium leading-6 text-gray-400">
                            followers
                          </dt>
                          <dd className="order-1 text-5xl font-extrabold text-primary">
                            50K+
                          </dd>
                        </div>
                        <div className="flex flex-col border-t border-background p-6 text-center sm:border-0 sm:border-l">
                          <dt className="order-2 mb-2 text-lg font-medium leading-6 text-gray-400">
                            playlists
                          </dt>
                          <dd className="order-1 text-5xl font-extrabold text-primary">
                            6,000+
                          </dd>
                        </div> */}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative py-16 sm:py-24">
              <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24 lg:px-8">
                <div className="relative top-3 sm:py-16 lg:py-0">
                  <div
                    aria-hidden="true"
                    className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
                  >
                    <div className="absolute inset-y-0 right-1/2 w-full rounded-r-3xl bg-foreground lg:right-72" />
                    {/* <svg
                      className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                      width={404}
                      height={392}
                      fill="none"
                      viewBox="0 0 404 392"
                    >
                      <defs>
                        <pattern
                          id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                          x={0}
                          y={0}
                          width={20}
                          height={20}
                          patternUnits="userSpaceOnUse"
                        >
                          <rect
                            x={0}
                            y={0}
                            width={4}
                            height={4}
                            className="text-gray-200"
                            fill="currentColor"
                          />
                        </pattern>
                      </defs>
                      <rect
                        width={404}
                        height={392}
                        fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
                      />
                    </svg> */}
                  </div>
                  <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:px-0 lg:py-20">
                    {/* Testimonial card */}
                    <div className="relative overflow-hidden rounded-2xl pt-72 pb-4 shadow-xl">
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://media.discordapp.net/attachments/858019685119295488/1063231762584576020/soundtrap-d0sXdsCnhF8-unsplash_copy.jpg"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-transparent mix-blend-multiply" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 opacity-90" />
                      <div className="relative px-8">
                        {/* <div>
                          <img
                            className="h-12"
                            src="https://tailwindui.com/img/logos/workcation.svg?color=white"
                            alt="Workcation"
                          />
                        </div> */}
                        <blockquote className="mt-8">
                          <div className="relative text-lg font-medium text-white md:grow">
                            <svg
                              className="absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 text-stone-400"
                              fill="currentColor"
                              viewBox="0 0 32 32"
                              aria-hidden="true"
                            >
                              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                            </svg>
                            <p className="relative font-medium text-white">
                              Tincidunt integer commodo, cursus etiam aliquam
                              neque, et. Consectetur pretium in volutpat, diam.
                              Montes, magna cursus nulla feugiat dignissim id
                              lobortis amet.
                            </p>
                          </div>

                          <footer className="mt-4">
                            <p className="text-base font-bold text-neutral-300">
                              Johnny Doe, singer songwriter
                            </p>
                          </footer>
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
                  {/* Content area */}
                  <div className="pt-12 sm:pt-16 lg:pt-20">
                    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      On a mission to take your musical carreer off
                    </h2>
                    <div className="mt-3 space-y-4 text-gray-500">
                      <p className="text-lg">
                        Sagittis scelerisque nulla cursus in enim consectetur
                        quam. Dictum urna sed consectetur neque tristique
                        pellentesque.
                      </p>
                      <p className="text-base leading-7">
                        Sollicitudin tristique eros erat odio sed vitae,
                        consequat turpis elementum. Lorem nibh vel, eget pretium
                        arcu vitae. Eros eu viverra donec ut volutpat donec
                        laoreet quam urna.
                      </p>
                      {/* <p className="text-base leading-7">
                        Rhoncus nisl, libero egestas diam fermentum dui. At quis
                        tincidunt vel ultricies. Vulputate aliquet velit
                        faucibus semper. Pellentesque in venenatis vestibulum
                        consectetur nibh id. In id ut tempus egestas. Enim sit
                        aliquam nec, a. Morbi enim fermentum lacus in. Viverra.
                      </p> */}
                    </div>
                  </div>

                  {/* Stats section */}
                  <div className="mt-3">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-0">
                      {secondStats.map((stat) => (
                        <div key={stat.label} className="pt-6">
                          <dt className="text-base font-medium text-gray-400">
                            {stat.label}
                          </dt>
                          <dd className="text-3xl font-extrabold tracking-tight text-white">
                            {stat.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {/* <div className="mt-10">
                      <a
                        href="#"
                        className="text-base font-medium text-green-500"
                      >
                        {' '}
                        Learn more about how Johnny Doe's story{' '}
                        <span aria-hidden="true">&rarr;</span>{' '}
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats section */}
            {/* <div className="relative bg-green-700">
              <div className="absolute inset-x-0 bottom-0 h-80 xl:top-0 xl:h-full">
                <div className="h-full w-full xl:grid xl:grid-cols-2">
                  <div className="h-full xl:relative xl:col-start-2">
                    <img
                      className="h-full w-full object-cover opacity-25 xl:absolute xl:inset-0"
                      src="https://media.discordapp.net/attachments/858019685119295488/1063222461392494673/billy-freeman-yvgQ0bWMmpY-unsplash_copy.jpg"
                      alt="People working on laptops"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-green-700 xl:inset-y-0 xl:left-0 xl:h-full xl:w-32 xl:bg-gradient-to-r"
                    />
                  </div>
                </div>
              </div>
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-flow-col-dense xl:grid-cols-2 xl:gap-x-8">
                <div className="relative pt-12 pb-64 sm:pt-24 sm:pb-64 xl:col-start-1 xl:pb-24">
                  <h2 className="text-sm font-semibold uppercase tracking-wide">
                    <span className="bg-gradient-to-r from-green-300 to-green-300 bg-clip-text text-transparent">
                      Valuable Metrics
                    </span>
                  </h2>
                  <p className="mt-3 text-3xl font-extrabold text-white">
                    Get actionable data that will help grow your business
                  </p>
                  <p className="mt-5 text-lg text-gray-300">
                    Rhoncus sagittis risus arcu erat lectus bibendum. Ut in
                    adipiscing quis in viverra tristique sem. Ornare feugiat
                    viverra eleifend fusce orci in quis amet. Sit in et vitae
                    tortor, massa. Dapibus laoreet amet lacus nibh integer quis.
                    Eu vulputate diam sit tellus quis at.
                  </p>
                  <div className="mt-12 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2">
                    {metrics.map((item) => (
                      <p key={item.id}>
                        <span className="block text-2xl font-bold text-white">
                          {item.stat}
                        </span>
                        <span className="mt-1 block text-base text-gray-300">
                          <span className="font-medium text-white">
                            {item.emphasis}
                          </span>{' '}
                          {item.rest}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div> */}

            {/* CTA Section */}
            <div className="hidden">
              <div className="mx-auto max-w-4xl py-16 px-4 sm:px-6 sm:py-24 lg:flex lg:max-w-7xl lg:items-center lg:justify-between lg:px-8">
                <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block text-white">
                    Ready to get started?
                  </span>
                  <span className="block bg-gradient-to-r from-green-500 to-green-500 bg-clip-text font-bold text-transparent">
                    Get in touch or sign up now.
                  </span>
                </h2>
                {/* <div className="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-5">
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-green-600 to-green-600 bg-origin-border px-4 py-3 text-base font-medium text-white shadow-sm hover:from-green-700 hover:to-green-700"
                  >
                    Learn more
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-md border border-transparent bg-green-50 px-4 py-3 text-base font-medium text-green-800 shadow-sm hover:bg-green-100"
                  >
                    Get started
                  </a>
                </div> */}
              </div>
            </div>

            <div className="relative ">
              {/* <div className="lg:absolute lg:inset-0">
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                  <img
                    className="h-56 w-full object-cover lg:absolute lg:h-full"
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"
                    alt=""
                  />
                </div>
              </div> */}

              <div className="relative py-16 px-4 sm:py-24 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:px-8 lg:py-32">
                <div className="lg:pr-8">
                  <div className="mx-auto max-w-md sm:max-w-lg lg:mx-0">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                      Let&apos;s work together
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 sm:mt-3">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Illo fugiat soluta dolore laudantium, voluptatem itaque
                      fuga exercitationem iusto, ratione quis culpa qui eum
                      perspiciatis, quae odio! Dolorum assumenda mollitia quae.
                    </p>
                    <form
                      action="#"
                      method="POST"
                      className="mt-9 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                    >
                      <div>
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium text-gray-400"
                        >
                          First name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="first-name"
                            id="first-name"
                            autoComplete="given-name"
                            className=" block w-full rounded-md border-gray-300 bg-foreground py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-medium text-gray-400"
                        >
                          Last name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="last-name"
                            id="last-name"
                            autoComplete="family-name"
                            className="block w-full rounded-md border-gray-300 bg-foreground py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-400"
                        >
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="block w-full rounded-md border-gray-300 bg-foreground py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <fieldset className="sm:col-span-2">
                        <legend className="block text-sm font-medium text-gray-400">
                          Current monthly streams
                        </legend>
                        <div className="mt-4 grid grid-cols-1 gap-y-4">
                          <div className="flex items-center">
                            <input
                              id="budget-under-25k"
                              name="budget"
                              defaultValue="under_25k"
                              type="radio"
                              className="h-4 w-4 border-gray-300 bg-foreground text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="budget-under-25k" className="ml-3">
                              <span className="block text-sm text-gray-200">
                                Less than 500
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="budget-25k-50k"
                              name="budget"
                              defaultValue="25k-50k"
                              type="radio"
                              className="h-4 w-4 border-gray-300 bg-foreground text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="budget-25k-50k" className="ml-3">
                              <span className="block text-sm text-gray-200">
                                500-1K
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="budget-50k-100k"
                              name="budget"
                              defaultValue="50k-100k"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="budget-50k-100k" className="ml-3">
                              <span className="block text-sm text-gray-200">
                                1K-10K
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="budget-over-100k"
                              name="budget"
                              defaultValue="over_100k"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="budget-over-100k" className="ml-3">
                              <span className="block text-sm text-gray-200">
                                10K+
                              </span>
                            </label>
                          </div>
                        </div>
                      </fieldset>
                      <div className="sm:col-span-2">
                        <div className="flex justify-between">
                          <label
                            htmlFor="how-did-you-hear-about-us"
                            className="block text-sm font-medium text-gray-400"
                          >
                            How did you find us?
                          </label>
                          <span
                            id="phone-description"
                            className="text-sm text-gray-500"
                          >
                            Optional
                          </span>
                        </div>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="how-did-you-hear-about-us"
                            id="how-did-you-hear-about-us"
                            className="block w-full rounded-md border-gray-300 bg-foreground py-2 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="text-right sm:col-span-2">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:bg-green-700"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="mt-20 w-full pt-10">
                  <div className="mt-5 mb-8 flex flex-col gap-3">
                    <FeatureItem Icon={MdLock} title="Thing #1">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Reprehenderit esse omnis, vitae incidunt officia eveniet,
                      voluptas in fugiat fugit quos illum.
                    </FeatureItem>
                    <FeatureItem Icon={MdShowChart} title="Thing #2">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Reprehenderit esse omnis, vitae incidunt officia eveniet,
                      voluptas in fugiat fugit quos illum.
                    </FeatureItem>
                    <FeatureItem Icon={MdFormatListBulleted} title="Thing #3">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Reprehenderit esse omnis, vitae incidunt officia eveniet,
                      voluptas in fugiat fugit quos illum.
                    </FeatureItem>
                    <FeatureItem Icon={MdHistory} title="Thing #4">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Reprehenderit esse omnis, vitae incidunt officia eveniet,
                      voluptas in fugiat fugit quos illum.
                    </FeatureItem>
                  </div>
                </div>
                {/* <div className="ml-5 mt-10 hidden lg:block">
                  <nav aria-label="Progress">
                    <ol role="list" className="overflow-hidden">
                      {steps.map((step, stepIdx) => (
                        <li
                          key={step.name}
                          className={classNames(
                            stepIdx !== steps.length - 1 ? 'pb-10' : '',
                            'relative'
                          )}
                        >
                          {step.status === 'complete' ? (
                            <>
                              {stepIdx !== steps.length - 1 ? (
                                <div
                                  className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-green-600"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <a
                                href={step.href}
                                className="group relative flex items-start"
                              >
                                <span className="flex h-9 items-center">
                                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 group-hover:bg-green-800">
                                    <CheckIcon
                                      className="h-5 w-5 text-white"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </span>
                                <span className="ml-4 flex min-w-0 flex-col">
                                  <span className="text-xs font-semibold uppercase tracking-wide">
                                    {step.name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {step.description}
                                  </span>
                                </span>
                              </a>
                            </>
                          ) : step.status === 'current' ? (
                            <>
                              {stepIdx !== steps.length - 1 ? (
                                <div
                                  className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <a
                                href={step.href}
                                className="group relative flex items-start"
                                aria-current="step"
                              >
                                <span
                                  className="flex h-9 items-center"
                                  aria-hidden="true"
                                >
                                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 bg-white">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                                  </span>
                                </span>
                                <span className="ml-4 flex min-w-0 flex-col">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                                    {step.name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {step.description}
                                  </span>
                                </span>
                              </a>
                            </>
                          ) : (
                            <>
                              {stepIdx !== steps.length - 1 ? (
                                <div
                                  className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <a
                                href={step.href}
                                className="group relative flex items-start"
                              >
                                <span
                                  className="flex h-9 items-center"
                                  aria-hidden="true"
                                >
                                  <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                                    <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                                  </span>
                                </span>
                                <span className="ml-4 flex min-w-0 flex-col">
                                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    {step.name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {step.description}
                                  </span>
                                </span>
                              </a>
                            </>
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div> */}
              </div>
            </div>

            <div className="mb-10 bg-foreground">
              <div className="mx-auto max-w-4xl py-16 px-4 sm:px-6 sm:py-24 lg:flex lg:max-w-7xl lg:items-center lg:justify-between lg:px-8">
                <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-4xl">
                  <span className="block text-white">
                    Questions or uncertainties?
                  </span>
                  <span className="block bg-gradient-to-r from-green-500 to-green-500 bg-clip-text font-bold text-transparent">
                    Get in touch with us now.
                  </span>
                </h2>
                <div className="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-5">
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-xl border border-transparent bg-green-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-600/70 sm:px-8"
                  >
                    Contact us
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-center rounded-xl border border-transparent bg-white px-4 py-3 text-base font-medium text-green-700 shadow-sm hover:bg-green-50 sm:px-8"
                  >
                    Sign up
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Stars;
