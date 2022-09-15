import Link from 'next/link';
import { useAuth } from '@/hooks';

import { MdAccountCircle, MdExitToApp, MdManageAccounts } from 'react-icons/md';
import { Logo } from './Logo';
import { Avatar } from './Avatar/Avatar';
import { Button } from './Button';
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

        {user ? (
          <Menu>
            <Menu.Button>
              <Avatar name={user.displayName} src={user.image} />
            </Menu.Button>

            <Menu.Items>
              <Menu.Item disabled className="flex gap-2">
                <Avatar size="md" name={user.displayName} src={user.image} />
                <div>
                  <h5>{user.displayName}</h5>
                  <p className="m-0">{user.email}</p>
                </div>
              </Menu.Item>
              <Menu.Item icon={<MdAccountCircle />}>
                <Link href={`/${user.customId ?? user.id}`}>My page</Link>
              </Menu.Item>
              <Menu.Item disabled icon={<MdManageAccounts />}>
                My account
              </Menu.Item>
              <Menu.Item icon={<MdExitToApp />} onClick={handleLogOutClick}>
                Log out
              </Menu.Item>
            </Menu.Items>
          </Menu>
        ) : (
          <Link href="/login">
            {/* TODO: same height as avatar to prevent jank */}
            <Button style={{ height: 64 }}>Log in</Button>
          </Link>
        )}
      </Container>
    </nav>
  );
};
