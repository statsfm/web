import { GOOGLE_ANALYTICS_ID } from '@/constants';
import { ToasterContainer } from '@/context/toaster';
import { GoogleAnalytics } from '@next/third-parties/google';

import type { FC, ReactNode } from 'react';

import { Title } from './Title';
import { NavBar } from './Navbar';
import { Footer } from './Footer';
import ErrorBoundary from './ErrorBoundary';

export const MainLayout: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <ToasterContainer>
    <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
    <Title />
    <NavBar />
    <ErrorBoundary>{children}</ErrorBoundary>
    <Footer />
  </ToasterContainer>
);
