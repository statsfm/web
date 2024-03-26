import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC, PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { MdMenu, MdOpenInNew } from 'react-icons/md';

const SideNavItem: FC<
  PropsWithChildren<{ href: string; disabled?: boolean; external?: boolean }>
> = (props) => {
  const { pathname } = useRouter();

  return (
    <Link legacyBehavior href={props.disabled ? '' : props.href}>
      <a
        className={clsx(
          pathname === props.href
            ? 'bg-foreground text-primary'
            : 'bg-transparent text-neutral-500',
          props.disabled
            ? 'opacity-40 focus:bg-transparent hover:cursor-not-allowed hover:bg-transparent'
            : 'focus:bg-foreground hover:bg-foreground hover:opacity-90',
          ' -ml-4 flex items-center rounded-lg px-4 py-1.5 font-medium',
        )}
      >
        {props.children}
        {props.external && <MdOpenInNew className="ml-1 h-4" />}
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
    <h3 className="mb-2 hidden text-2xl sm:block">Settings</h3>

    <aside className="flex flex-col gap-1 sm:gap-2">
      <NavGroup title="Account">
        <SideNavItem href="/settings/profile">Profile</SideNavItem>
        <SideNavItem href="/settings/privacy">Privacy</SideNavItem>
        <SideNavItem href="/settings/connections">Connections</SideNavItem>
      </NavGroup>

      <NavGroup title="Stats & algorithms">
        <SideNavItem href="/settings/imports">Imports</SideNavItem>
      </NavGroup>

      <NavGroup title="Plus">
        <SideNavItem href="/gift" external>
          Gifts
        </SideNavItem>
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
      <Popover.Button className="relative z-20 flex size-10 items-center justify-center rounded-md bg-foreground sm:hidden">
        <MdMenu className="h-10 text-white" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-100 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Popover.Overlay className="pointer-events-auto fixed inset-0 z-10 bg-black/60" />
      </Transition>

      <Transition
        as={Fragment}
        enter="transition duration-100 ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-100 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <Popover.Panel className="absolute top-16 z-20 ">
          <div className="rounded-xl bg-background py-2 pl-6 pr-4">
            <NavBody />
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
