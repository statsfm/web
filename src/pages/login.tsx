import type { NextPage } from 'next';
import { useAuth } from '@/hooks';
import { Container } from '@/components/Container';
import { Button } from '@/components/Button';
import { SpotifyIcon } from '@/components/Icons';

const Login: NextPage = () => {
  const auth = useAuth();

  return (
    <Container className="flex min-h-[90vh] pt-24">
      <div className="mx-auto mt-48 flex w-96 flex-col px-4">
        <h1 className="w-full text-center text-4xl text-white">
          Login to stats.fm
        </h1>
        <div className="mt-8 flex flex-col gap-4">
          <Button
            onClick={() => {
              auth.logout();
              auth.login();
            }}
            className="w-full bg-primary/80 text-black hover:bg-primary/60 active:bg-primary/50"
          >
            <SpotifyIcon className="mr-2 !fill-black" />
            Continue with spotify
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Login;
