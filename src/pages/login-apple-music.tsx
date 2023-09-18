import type { NextPage, GetServerSideProps } from 'next';
import { useAuth, useToaster } from '@/hooks';
import { Container } from '@/components/Container';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { LoginAppleMusicButton } from '@/components/Login/LoginAppleMusicButton';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const Login: NextPage<SSRProps> = ({ user }) => {
  const auth = useAuth();
  const router = useRouter();
  const toaster = useToaster();

  useEffect(() => {
    const { redirect, failed } = router.query;
    if (failed) {
      toaster.error('Something went wrong trying to login. Please try again.');
    }

    if (!user?.id) router.push('/login');
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
          userId={(auth?.user && auth?.user.id) || ''}
          redirect={true}
        />
      </div>
    </Container>
  );
};

export default Login;
