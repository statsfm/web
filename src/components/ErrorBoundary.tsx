import type { ErrorInfo, PropsWithChildren } from 'react';
import React from 'react';
import { Container } from './Container';
import { Title } from './Title';

type Props = PropsWithChildren<{}>;

class ErrorBoundary extends React.Component<Props, { error: Error | null }> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.error) {
      const errorMessage = `${this.state.error.name}, ${this.state.error.message}\n\n${this.state.error.stack}`;

      return (
        <Container className="flex min-h-screen items-center pt-32">
          <Title>Client Side Error!</Title>
          <div className="flex w-full flex-col justify-center">
            <p className="-mt-2 text-center text-xl">
              An error occured while doing something. <br />
              Please report any bug in our{' '}
              <a
                className="text-white hover:underline"
                href="https://stats.fm/discord"
              >
                discord
              </a>{' '}
              !
            </p>
            <details>
              <summary className="my-4 cursor-pointer text-center text-xl text-neutral-400">
                (make sure to include the technical stuff (click to reveal))
              </summary>
              <pre className="w-full whitespace-pre-line">{errorMessage}</pre>
            </details>
            <p className="mt-8 text-center">try refreshing or</p>
            {/* this has to be an html a tag to refresh the client which resets the errored state */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="mx-auto w-fit rounded-xl bg-primaryLighter px-4 py-3 font-bold text-primary"
            >
              Go back home
            </a>
          </div>
        </Container>
      );
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
