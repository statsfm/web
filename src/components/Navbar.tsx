import Link from 'next/link';
import { useAuth } from '@/hooks';

import { MdAccountCircle, MdExitToApp, MdManageAccounts } from 'react-icons/md';
import { Logo } from './Logo';
import { Avatar } from './Avatar/Avatar';
import { Menu } from './Menu';
import { Container } from './Container';

export const NavBar = () => {
  const { user, logout } = useAuth();

  const handleLogOutClick = () => {
    logout();
  };

  return (
    <nav className="absolute z-40 flex w-full">
      <Container className="flex w-full items-center justify-between bg-inherit py-3">
        <Link href="/" passHref>
          <a className="flex gap-3">
            <Logo className="h-[1.7rem] w-[1.7rem] cursor-pointer" />
            <h3 className="mt-[-3px]">Stats.fm</h3>
          </a>
        </Link>

        {/* TODO: disappear on intersection observer */}
        {user ? (
          <Menu>
            <Menu.Button>
              <Avatar name={user.displayName} src={user.image} />
            </Menu.Button>

            <Menu.Items>
              <Menu.Item className="focus:bg-transparent">
                <Link href={`/${user.customId ?? user.id}`}>
                  <a className="flex gap-2">
                    <Avatar
                      size="md"
                      name={user.displayName}
                      src={user.image}
                    />
                    <div>
                      <h5>{user.displayName}</h5>
                      <p className="m-0">{user.email}</p>
                    </div>
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href={`/${user.customId ?? user.id}`}>
                  <a className="flex h-full w-full flex-row gap-2">
                    <MdAccountCircle className="text-white" /> My page
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/settings/profile">
                  <a className="flex h-full w-full flex-row gap-2">
                    <MdManageAccounts className="text-white" /> Settings
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item icon={<MdExitToApp />} onClick={handleLogOutClick}>
                Log out
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Link href="/login">
            <a className="my-2 flex h-12 items-center justify-center whitespace-nowrap rounded-2xl bg-primary/10 py-2 px-5 text-base font-bold text-primary shadow-sm transition-colors hover:bg-primary/20 active:bg-primary/5">
              Log in
            </a>
          </Link>
        )}
      </Container>
    </nav>
  );
};