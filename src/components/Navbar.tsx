import Link from 'next/link';
import { useAuth } from '@/hooks';

import { MdAccountCircle, MdExitToApp, MdManageAccounts } from 'react-icons/md';
import { Transition } from '@headlessui/react';
import { event } from 'nextjs-google-analytics';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Logo } from './Logo';
import { Avatar } from './Avatar/Avatar';
import { Menu } from './Menu';
import { Container } from './Container';
import { Button } from './Button';
import { CrownIcon } from './Icons';

export const NavBar = () => {
  const { user, logout, login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    // if a redirect url is already set (which happens when you are auth guarded), dont set it again
    const redirectUrl = Cookies.get('redirectUrl');
    login(redirectUrl || router.asPath);
  };

  const handleLogOutClick = () => {
    logout();
  };

  return (
    <nav className="absolute z-40 flex w-full">
      <Container className="flex w-full items-center bg-inherit py-3">
        <Link
          href="/"
          className="mr-auto flex gap-3"
          onClick={() => event('NAV_home')}
        >
          <Logo className="h-[1.7rem] w-[1.7rem] cursor-pointer" />
          <h3 className="mt-[-3px]">stats.fm</h3>
        </Link>

        {user && !user.isPlus && router.pathname !== '/plus' && (
          <Link
            className="mr-0 flex flex-row gap-1 px-4 py-2 font-bold text-plus lg:mr-2 lg:font-medium"
            href="/plus"
          >
            <CrownIcon className="m-[2px] mt-0 h-[20px] w-[20px] lg:mt-[2px]" />
            Get Plus
          </Link>
        )}

        {/* TODO: move animation to Menu component itself? */}
        {user ? (
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button>
                  <Avatar name={user.displayName} src={user.image} />
                </Menu.Button>

                <Transition
                  as="div"
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items>
                    <Menu.Item
                      className="!p-0 focus:!bg-transparent"
                      onClick={() => event('NAV_profile')}
                    >
                      <Link
                        className="flex gap-2 px-4 py-2"
                        href={`/${user.customId ?? user.id}`}
                      >
                        <Avatar
                          size="md"
                          name={user.displayName}
                          src={user.image}
                        />
                        <div>
                          <h5>{user.displayName}</h5>
                          <p className="m-0">{user.email}</p>
                        </div>
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      className="!p-0"
                      onClick={() => event('NAV_profile')}
                    >
                      <Link
                        className="flex h-full w-full flex-row gap-2 px-4 py-2"
                        href={`/${user.customId ?? user.id}`}
                      >
                        <MdAccountCircle className="text-white" /> My page
                      </Link>
                    </Menu.Item>
                    <Menu.Item
                      className="!p-0"
                      onClick={() => event('NAV_settings')}
                    >
                      <Link
                        className="flex h-full w-full flex-row gap-2 px-4 py-2"
                        href="/settings/profile"
                      >
                        <MdManageAccounts className="text-white" /> Settings
                      </Link>
                    </Menu.Item>

                    {!user.isPlus && router.pathname !== '/plus' && (
                      <Menu.Item
                        className="!p-0"
                        onClick={() => event('NAV_plus')}
                      >
                        <Link
                          className="flex h-full w-full flex-row gap-2 px-4 py-2 text-plus"
                          href="/plus"
                        >
                          <CrownIcon className="m-[2px] h-[20px] w-[20px]" />{' '}
                          Get Plus
                        </Link>
                      </Menu.Item>
                    )}
                    <hr className="my-1 mx-3 border-t-2 border-neutral-400/10" />
                    <Menu.Item
                      icon={<MdExitToApp />}
                      onClick={() => {
                        event('NAV_logout');
                        handleLogOutClick();
                      }}
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        ) : (
          <Button onClick={handleLogin} className="my-2">
            Log in
          </Button>
        )}
      </Container>
    </nav>
  );
};
