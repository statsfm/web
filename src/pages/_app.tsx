import '../styles/globals.css';

import { AuthProvider } from '@/context/auth';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { Title } from '@/components/Title';
import type { AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { ToasterContainer } from '@/context/toaster';
import Head from 'next/head';
import { useRouter } from 'next/router';

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
const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  // only show default ogp tags for routes who don't define their own
  const showOgp = ![
    '/user/[id]',
    '/artist/[id]',
    '/track/[id]',
    '/album/[id]',
  ].includes(router.pathname);

  return (
    <>
      <AuthProvider>
        <Head>
          <title>Stats.fm</title>
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
          <Component {...pageProps} />
          <Footer />
        </ToasterContainer>
      </AuthProvider>
    </>
  );
};
export default App;
