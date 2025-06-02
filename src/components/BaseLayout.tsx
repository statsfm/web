import { GoogleAnalytics, event } from 'nextjs-google-analytics';
import ErrorBoundary from './ErrorBoundary';
import { FC, ReactNode } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Container } from './Container';

export const BaseLayout: FC<{
  children: ReactNode;
}> = ({ children }) => (
  <>
    <GoogleAnalytics trackPageViews gaMeasurementId="G-GD9GE041CW" />
    <nav className="absolute z-40 flex w-full">
      <Container className="flex w-full items-end bg-inherit py-3 ml-2 mt-2">
        <Link
          href="/"
          className="mr-auto flex gap-3 lg:mr-12 items-center"
          onClick={() => event('NAV_home')}
        >
          <Logo className="size-[1.7rem] cursor-pointer" />
          <h3 className="text-4xl">stats.fm</h3>
        </Link>
      </Container>
    </nav>
    <ErrorBoundary>{children}</ErrorBoundary>
  </>
);
