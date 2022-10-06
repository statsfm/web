import Head from 'next/head';
import type { FC, PropsWithChildren } from 'react';

export const Title: FC<
  PropsWithChildren<{ noDivider?: boolean; reverse?: boolean }>
> = ({ noDivider, children, reverse }) => {
  const divider = children && !noDivider ? '|' : '';
  const title = reverse
    ? `stats.fm ${divider} ${children || ''}`
    : `${children || ''} ${divider} stats.fm`;

  return (
    <Head>
      <title>{title}</title>
      <meta key="huts" property="og:title" content={title} />
    </Head>
  );
};
