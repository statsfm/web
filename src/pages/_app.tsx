import '@/styles/globals.css';

import { AuthProvider } from '@/context/auth';
import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { Title } from '@/components/Title';
import type { AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { ToasterContainer } from '@/context/toaster';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { UserPrivate } from '@statsfm/statsfm.js';
import localFont from '@next/font/local';
import clsx from 'clsx';
import ErrorBoundary from '@/components/ErrorBoundary';

// TODO: this is the stupidest solution to the worst issue ever, works for now
// https://github.com/tailwindlabs/headlessui/discussions/666#discussioncomment-1891380
if (typeof window !== 'undefined') {
  const elementById = Document.prototype.getElementById;
  // eslint-disable-next-line func-names
  Document.prototype.getElementById = function (elementId: string) {
    if (elementId === 'headlessui-portal-root') {
      return document.getElementById('PortalRoot');
    }
    return elementById.call(this, elementId);
  };
}

const StatsfmSans = localFont({
  variable: '--font-statsfm-sans',
  src: [
    { path: './fonts/StatsfmSans-Thin.ttf', weight: '100' },
    { path: './fonts/StatsfmSans-Light.ttf', weight: '300' },
    { path: './fonts/StatsfmSans-Regular.ttf', weight: '400' },
    { path: './fonts/StatsfmSans-Medium.ttf', weight: '500' },
    { path: './fonts/StatsfmSans-Bold.ttf', weight: '700' },
  ],
});

const Ogp = () => (
  <>
    <meta
      name="description"
      content="Your music, your stats, your story. Enter a new dimension of music by getting unique insights into your music taste."
    />
    <meta property="og:title" content="stats.fm" />
    <meta
      property="og:description"
      content="Your music, your stats, your story. Enter a new dimension of music by getting unique insights into your music taste."
    />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://stats.fm" />
    <meta
      property="og:image"
      content="https://next.stats.fm/images/banner.png"
    />

    <meta property="twitter:card" content="summary_large_image" />
  </>
);

// TODO: we'll probably rewrite the auth logic to use a state management store instead of context, but we implemented this temporary for development
const App = ({ Component, pageProps }: AppProps<{ user?: UserPrivate }>) => {
  const router = useRouter();
  // only show default ogp tags for routes who don't define their own
  const showOgp = ![
    '/user/[id]/[[...deeplink]]',
    '/artist/[id]',
    '/track/[id]',
    '/album/[id]',
  ].includes(router.pathname);

  return (
    <main className={clsx(StatsfmSans.variable, 'font-body')}>
      <AuthProvider user={pageProps.user}>
        <Head>
          <title>stats.fm</title>
          <meta property="og:site_name" content="stats.fm" />
          <meta property="og:url" content="https://stats.fm/" />
          <meta property="og:type" content="website" />
          <meta property="twitter:site" content="@spotistats" />
          <meta property="twitter:creator" content="@spotistats" />
          {showOgp && <Ogp />}
        </Head>
        <ToasterContainer>
          <GoogleAnalytics trackPageViews gaMeasurementId="G-GD9GE041CW" />
          <Title />
          <NavBar />
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <Footer />
        </ToasterContainer>
      </AuthProvider>
      <section id="PortalRoot" />
    </main>
  );
};
export default App;
