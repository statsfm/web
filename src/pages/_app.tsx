import '@/styles/globals.css';

import clsx from 'clsx';
import Head from 'next/head';
import { useRouter } from 'next/router';
import localFont from 'next/font/local';
import type { AppProps } from 'next/app';

import { AuthProvider } from '@/context/auth';
import type { UserPrivate } from '@/utils/statsfm';
import { MainLayout } from '@/components/MainLayout';
import { BaseLayout } from '@/components/BaseLayout';
import { DefaultOGPHeaders } from '@/components/DefaultOGPHeaders';
import { PAGES_WITH_BASE_LAYOUT, PAGES_WITH_CUSTOM_OGP } from '@/constants';

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

// TODO: we'll probably rewrite the auth logic to use a state management store instead of context, but we implemented this temporary for development
const App = ({
  Component,
  pageProps,
}: AppProps<{ user?: UserPrivate | null }>) => {
  const router = useRouter();

  const showDefaultOgp = !PAGES_WITH_CUSTOM_OGP.includes(router.pathname);
  const showMainLayout = !PAGES_WITH_BASE_LAYOUT.includes(router.pathname);

  const LayoutComponent = showMainLayout ? MainLayout : BaseLayout;

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
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6037791262117379"
            crossOrigin="anonymous"
          ></script>
          {showDefaultOgp && <DefaultOGPHeaders />}
        </Head>
        <LayoutComponent>
          <Component {...pageProps} />
        </LayoutComponent>
      </AuthProvider>
    </main>
  );
};
export default App;
