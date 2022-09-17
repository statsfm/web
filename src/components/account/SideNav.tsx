import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, PropsWithChildren } from 'react';

const SideNavItem: FC<PropsWithChildren<{ href: string }>> = (props) => {
  const { pathname } = useRouter();

  return (
    <Link href={props.href}>
      <a
        className={clsx(
          pathname === props.href
            ? 'bg-bodySecundary text-primary'
            : 'bg-transparent text-white',
          '-ml-4 block rounded-lg px-4 py-2 font-bold  hover:bg-bodySecundary hover:opacity-90 focus:bg-bodySecundary'
        )}
      >
        {props.children}
      </a>
    </Link>
  );
};

export const SideNav: FC = () => {
  return (
    <aside className="flex flex-col gap-1">
      <SideNavItem href="/account">Account & Privacy</SideNavItem>
      {/* <SideNavItem href="/account/import">Import</SideNavItem> */}
      <SideNavItem href="/account/connections">Connections</SideNavItem>
      {/* <SideNavItem href="/account/algorithms">Stats & Algorithms</SideNavItem> */}
      {/* <SideNavItem href="/account/lang">Language & Theme</SideNavItem> */}
    </aside>
  );
};
