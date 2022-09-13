import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import { MdChevronRight } from 'react-icons/md';

type ChevronLinkProps = FC<
  PropsWithChildren<{ href: string; local?: boolean }>
>;

export const ChevronLink: ChevronLinkProps = (props) => {
  const body = (
    <>
      {props.children} <MdChevronRight className="inline" />
    </>
  );

  if (props.local)
    return (
      <Link href={props.href}>
        <a className="flex flex-row items-center font-bold text-primary hover:underline hover:opacity-90">
          {body}
        </a>
      </Link>
    );

  return (
    <a
      href={props.href}
      className="flex flex-row items-center font-bold text-primary hover:underline hover:opacity-90"
      target="_blank"
      rel="noopener noreferrer"
    >
      {body}
    </a>
  );
};
