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
    <Title />
    <NavBar />
    <ErrorBoundary>{children}</ErrorBoundary>
    <Footer />
  </ToasterContainer>
);
