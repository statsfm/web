import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MdMenu } from 'react-icons/md';

const SideNavItem: FC<
  PropsWithChildren<{ href: string; disabled?: boolean }>
> = (props) => {
  const { pathname } = useRouter();

  return (
    <Link href={props.href}>
      <a
        className={clsx(
          // props.disabled && '!text-neutral-500 pointer-events-none',
          pathname === props.href
            ? 'bg-bodySecundary text-primary'
            : 'bg-transparent text-neutral-500',
          ' -ml-4 block rounded-lg px-4 py-1.5 font-medium hover:bg-bodySecundary hover:opacity-90 focus:bg-bodySecundary'
        )}
      >
        {props.children}
      </a>
    </Link>
  );
};

const NavGroup: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-4">
      <h4 className="-mt-1 text-xl text-white">{title}</h4>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

const NavBody: FC = () => (
  <nav>
    <h3 className="mb-2 text-2xl">Settings</h3>

    <aside className="flex flex-col gap-1 sm:gap-2">
      {/* <hr /> */}
      <NavGroup title="Account">
        <SideNavItem href="/settings/profile">Profile</SideNavItem>
        <SideNavItem href="/settings/privacy">Privacy</SideNavItem>
        <SideNavItem href="/settings/connections">Connections</SideNavItem>
        <SideNavItem disabled href="/settings/devices">
          Devices
        </SideNavItem>
      </NavGroup>

      <NavGroup title="Stats">
        <SideNavItem href="/account/import">Import</SideNavItem>
        <SideNavItem href="/account/import">Algorithms</SideNavItem>
        {/* <SideNavItem href="/account/algorithms">Stats & Algorithms</SideNavItem> */}
        {/* <SideNavItem href="/account/lang">Language & Theme</SideNavItem> */}
      </NavGroup>
    </aside>
  </nav>
);

export const SideNav: FC = () => {
  return (
    <div className="sticky top-0 hidden h-min shrink-0 py-4 sm:block md:w-48">
      <NavBody />
    </div>
  );
};

export const DropDownNav: FC = () => {
  return (
    <Popover>
      <Popover.Button className="relative z-20 flex h-10 w-10 items-center justify-center rounded-md bg-bodySecundary sm:hidden">
        <MdMenu className="h-10 text-white" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition duration-200 ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Popover.Overlay className="pointer-events-auto fixed inset-0 z-10 bg-black/60" />
      </Transition>

      <Transition
        as={Fragment}
        enter="transition duration-200 ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Popover.Panel className="absolute top-16 z-20 ">
          <div className="rounded-xl bg-background py-2 pr-4 pl-6">
            <NavBody />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
