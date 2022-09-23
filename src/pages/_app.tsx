import '../styles/globals.css';

import { AuthProvider } from '@/context/auth';

import { Footer } from '@/components/Footer';
import { NavBar } from '@/components/Navbar';
import { Title } from '@/components/Title';
import type { AppProps } from 'next/app';

// TODO: we'll probably rewrite the auth logic to use a state management store instead of context, but we implemented this temporary for development
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Title />
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
};
export default App;
