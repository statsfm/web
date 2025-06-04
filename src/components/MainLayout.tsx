import { GoogleAnalytics } from 'nextjs-google-analytics';

import { ToasterContainer } from '@/context/toaster';

import type { FC, ReactNode } from 'react';

import { Title } from './Title';
import { NavBar } from './Navbar';
import { Footer } from './Footer';
import ErrorBoundary from './ErrorBoundary';

export const MainLayout: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <ToasterContainer>
    <GoogleAnalytics trackPageViews gaMeasurementId="G-GD9GE041CW" />
    <Title />
    <NavBar />
    <ErrorBoundary>{children}</ErrorBoundary>
    <Footer />
  </ToasterContainer>
);
