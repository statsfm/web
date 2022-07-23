import '../styles/globals.css';

import { AuthProvider } from '@/context/auth';

import { NavBar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import type { AppProps } from 'next/app';

// TODO: we'll probably rewrite the auth logic to use a state management store instead of context, but we implemented this temporary for development
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <NavBar />
      <Container as="main">
        <Component {...pageProps} />
      </Container>
      <Footer />
    </AuthProvider>
  );
};
export default App;
