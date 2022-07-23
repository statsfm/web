import Link from 'next/link';
import { useAuth } from '@/hooks';
import { Container } from './Container';
import { Logo } from './Logo';
import { Avatar } from './Avatar/Avatar';
import { Button } from './Button';

export const NavBar = () => {
  const { user } = useAuth();

  return (
    <nav>
      <Container className="flex items-center justify-between py-3">
        <Link href="/" passHref>
          <a>
            <Logo className="h-[1.7rem] w-[1.7rem] cursor-pointer" />
          </a>
        </Link>

        {user ? (
          <Avatar name={user.displayName} src={user.image} />
        ) : (
          <Link href="/login">
            <Button>Log in</Button>
          </Link>
        )}
      </Container>
    </nav>
  );
};
