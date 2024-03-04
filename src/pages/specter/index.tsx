import { Title } from '@/components/Title';
import { MdKeyboardArrowRight, MdOutlineScience } from 'react-icons/md';
import type { NextPage } from 'next';
import { Logo } from '@/components/Logo';

const Specter: NextPage = () => {
  return (
    <>
      <Title>Specter</Title>
      <div className="bg-base-100 pb-8 pt-7 sm:pb-12 lg:pb-12">
        <div className="overflow-hidden pt-8 sm:pt-0 lg:relative lg:py-48">
          <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div>
              <div className="mt-3 sm:mt-8 md:mt-20">
                <div>
                  <a
                    href="https://stats.fm/plus"
                    className="inline-flex space-x-4"
                  >
                    <span className="rounded bg-plus px-2.5 py-1 text-sm font-bold text-black">
                      Plus
                    </span>
                    <span className="inline-flex items-center space-x-1 text-sm font-bold">
                      <span className="font-medium text-white">
                        Plus only user perk
                      </span>
                      <MdKeyboardArrowRight
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </div>
                <div className="mt-6 sm:max-w-xl">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-bold">
                    Specter
                  </h1>
                  <p className="mt-1 text-xl text-gray-300 font-medium">
                    Access all your stats.fm stats now on your desktop computer!
                  </p>
                </div>

                <div className="mt-5">
                  {/* <a
                      href="/"
                      className="inline-flex items-center rounded-full bg-black font-semibold p-1 pr-3 text-white hover:text-gray-200 sm:text-base lg:text-sm xl:text-base"
                    >
                      <span className="ml-4 mb-0.5 text-sm">Windows</span>
                      <MdCheck
                        className="ml-2 h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </a> */}
                  <a
                    href="https://testflight.apple.com/join/1xVyzRwt"
                    className="pl-4 inline-flex items-center rounded-full bg-black font-semibold p-1 pr-3 text-white hover:text-gray-200 sm:text-base lg:text-sm xl:text-base"
                  >
                    <span className="text-sm text-gray-300">macOS</span>
                    <MdOutlineScience
                      className="ml-2 h-5 w-5 text-gray-300"
                      aria-hidden="true"
                    />
                  </a>
                </div>

                <p>* Windows beta coming soon!</p>

                <div className="mt-4 sm:max-w-xl">
                  <p className="inline-flex space-x-3">
                    <Logo className="h-5 w-5 cursor-pointer" />
                    <span className="text-l text-gray-300 font-semibold">
                      by stats.fm
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="relative -mr-40 pl-6 sm:mx-auto sm:max-w-3xl sm:px-0 lg:h-full lg:max-w-none lg:pl-12">
                <img
                  className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  src="/images/specter-desktop-0.webp"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Specter;
