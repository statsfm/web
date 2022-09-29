import Head from 'next/head';
import type { FC, PropsWithChildren } from 'react';

export const Title: FC<
  PropsWithChildren<{ noDivider?: boolean; reverse?: boolean }>
> = ({ noDivider, children, reverse }) => {
  const divider = children && !noDivider ? '|' : '';
  const title = reverse
    ? `Stats.fm ${divider} ${children || ''}`
    : `${children || ''} ${divider} Stats.fm`;

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
};
