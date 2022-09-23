import Head from 'next/head';
import type { FC, PropsWithChildren } from 'react';

export const Title: FC<PropsWithChildren<{ noDivider?: boolean }>> = ({
  noDivider,
  children,
}) => {
  const divider = children && !noDivider ? '|' : null;

  return (
    <Head>
      <title>
        Stats.fm {divider} {children}
      </title>
    </Head>
  );
};
