import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import type { GetServerSideProps, NextPage } from 'next';
import Script from 'next/script';

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const solutions = [
  {
    name: 'Targeted Campaigns',
    description:
      'Boost every campaign: guaranteed precise targeting for tracks, merchandise, events. Maximize clicks and value.',
    image: '/images/partners/targeted_campaigns.png',
  },
  {
    name: 'Insight Packs',
    description:
      'Unlock your story with custom dashboards for insights on festivals, tours and launches with stats.fm.',
    image: '/images/partners/insight_packs.png',
  },
  // {
  //   name: 'Custom solutions',
  //   description:
  //     'Need something specific? We can build custom solutions tailored to your needs.',
  //   icon: MdTune,
  // },
];

const BusinessPage: NextPage = () => {
  return (
    <>
      <Title reverse noDivider>
        for partners
      </Title>
      <Container className="pt-24">
        <div className="relative">
          <div className="mx-auto max-w-7xl">
            <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
              <div className="absolute inset-0">
                <img
                  className="size-full object-cover"
                  src="/images/partners/artist_performing.jpeg"
                  alt="Artist performing"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-600 mix-blend-multiply" />
              </div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                <h1 className="text-center text-4xl font-extrabold leading-10 sm:text-5xl md:leading-[3.2rem] lg:text-6xl lg:leading-[3.8rem]">
                  <span className="block text-white">Your music</span>
                  <span className="block text-green-200">powered by data</span>
                </h1>
                <p className="mx-auto mt-6 max-w-lg text-center text-xl font-medium text-white sm:max-w-3xl">
                  Harness the full potential of streaming analytics with
                  stats.fm.
                </p>
                <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <a
                      href="#solutions"
                      className="flex items-center justify-center rounded-xl border border-transparent bg-white px-4 py-3 text-base font-medium text-green-700 shadow-sm hover:bg-green-50 sm:px-8"
                    >
                      Explore solutions
                    </a>
                    <a
                      href="#contact"
                      className="flex items-center justify-center rounded-xl border border-transparent bg-green-600/60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-green-600/70 sm:px-8"
                    >
                      Contact us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <p className="text-center text-base font-semibold text-gray-500">
              Companies that we have worked with
            </p>
            <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img
                  className="h-9"
                  src="/images/partners/downtown.svg"
                  alt="Downtown"
                />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img
                  className="h-9"
                  src="/images/partners/atlantic-records.svg"
                  alt="Atlantic Records"
                />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img
                  className="h-9"
                  src="/images/partners/fuga.svg"
                  alt="FUGA"
                />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img
                  className="h-9"
                  src="/images/partners/primavera-sound.svg"
                  alt="Primavera Sound"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="py-12">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                id="solutions"
              >
                Our solutions
              </h2>
            </div>
            <div className="mx-auto mt-5 max-w-2xl lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                {solutions.map((solution) => (
                  <div key={solution.name} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-white">
                      <div className="relative mb-3 w-full">
                        <img
                          src={solution.image}
                          className="w-full rounded-2xl object-cover"
                        />
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                      </div>

                      {solution.name}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7">
                      <p className="flex-auto">{solution.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mx-auto max-w-7xl py-24 sm:py-32">
              <div className="relative isolate overflow-hidden bg-foreground px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Custom solutions
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-400">
                  Need something specific? We can build custom solutions
                  tailored to your needs.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="#contact"
                    className="text-sm font-medium leading-6 text-primary"
                  >
                    Get in touch <span aria-hidden="true">→</span>
                  </a>
                </div>
                <svg
                  viewBox="0 0 1024 1024"
                  className="absolute left-1/2 top-1/2 -z-10 size-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                  aria-hidden="true"
                >
                  <circle
                    cx={512}
                    cy={512}
                    r={512}
                    fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
                    fillOpacity="0.7"
                  />
                  <defs>
                    <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                      <stop stopColor="#1ed760" />
                      <stop offset={1} stopColor="#1ed760" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Contact us
          </h2>
          <div className="flex-col gap-16 sm:gap-y-20 lg:flex-row">
            <iframe
              id="contact"
              data-tally-src="https://tally.so/embed/woyKBb?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              className="w-full"
              height="200"
              title="Contact form"
            ></iframe>

            <Script
              id="tally-js"
              src="https://tally.so/widgets/embed.js"
              onLoad={() => {
                // @ts-ignore
                Tally.loadEmbeds();
              }}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default BusinessPage;
