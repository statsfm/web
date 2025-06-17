import Link from 'next/link';
import { GoogleAnalytics } from '@next/third-parties/google';

import type { FC, ReactNode } from 'react';

import { Logo } from './Logo';
import { Container } from './Container';
import ErrorBoundary from './ErrorBoundary';

export const BaseLayout: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <>
    <GoogleAnalytics gaId="G-3PMBLRJDEB" />
    <nav className="absolute z-40 flex w-full">
      <Container className="ml-2 mt-2 flex w-full items-end bg-inherit py-3">
        <Link href="/" className="mr-auto flex items-center gap-3 lg:mr-12">
          <Logo className="size-[1.7rem] cursor-pointer" />
          <h3 className="text-4xl">stats.fm</h3>
        </Link>
      </Container>
    </nav>
    <ErrorBoundary>{children}</ErrorBoundary>
  </>
);
