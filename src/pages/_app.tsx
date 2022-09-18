import '../styles/globals.css';

import { AuthProvider } from '@/context/auth';

import { NavBar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Container } from '@/components/Container';

// TODO: we'll probably rewrite the auth logic to use a state management store instead of context, but we implemented this temporary for development
const App = ({ Component, pageProps }: AppProps) => {
  /* TODO: 
    this is a temporary solution to fix the homepage being wrapped in a Container element which messes with the layout,
    we will have to wrap all the other pages in a Container or leave it like this until nextjs implements layouts (later this year).
  */
  const { pathname } = useRouter();
  const noContainerPaths = [
    '/',
    '/settings/profile',
    '/settings/privacy',
    '/settings/connections',
    '/user/[id]',
    '/track/[id]',
    '/artist/[id]',
    '/album/[id]',
  ];

  const noContainer = noContainerPaths.includes(pathname);

  return (
    <AuthProvider>
      <NavBar />
      {noContainer ? (
        <Component {...pageProps} />
      ) : (
        <Container as="main">
          <Component {...pageProps} />
        </Container>
      )}
      <Footer />
    </AuthProvider>
  );
};
export default App;
