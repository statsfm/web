import type { NextPage } from 'next';
import { useApi, useAuth, useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LoginAppleMusicButton } from '@/components/Login/LoginAppleMusicButton';

const Login: NextPage = () => {
  const auth = useAuth();
  const api = useApi();
  const router = useRouter();
  const toaster = useToaster();

  useEffect(() => {
    const { redirect, failed } = router.query;
    if (failed) {
      toaster.error('Something went wrong trying to login. Please try again.');
    }

    if (!redirect) return;
    Cookies.set('redirectUrl', redirect.toString());
  }, [router]);

  return (
    <Container className="flex min-h-[90vh] pt-24">
      <div className="mx-auto mt-48 flex w-96 flex-col px-4">
        <h1 className="w-full text-center text-4xl text-white">
          Login to Apple Music
        </h1>
        <LoginAppleMusicButton
          userId={(auth && auth.user && auth.user.id) || ''}
          redirect={true}
          accessToken={api.http.config.accessToken}
        />
      </div>
    </Container>
  );
};

export default Login;
