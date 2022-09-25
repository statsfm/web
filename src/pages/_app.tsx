import '../styles/globals.css';

import { AuthProvider } from '@/context/auth';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { Title } from '@/components/Title';
import type { AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { ToasterContainer } from '@/context/toaster';
import Head from 'next/head';

// TODO: we'll probably rewrite the auth logic to use a state management store instead of context, but we implemented this temporary for development
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Stats.fm</title>
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
        <meta property="og:image" content="/images/banner.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@spotistats" />
        <meta name="twitter:creator" content="@spotistats" />
      </Head>
      <AuthProvider>
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
