import type { NextPage } from 'next';
import { useAuth } from '@/hooks';
import { useEffect } from 'react';
import { Container } from '@/components/Container';

const Login: NextPage = () => {
  const auth = useAuth();

  useEffect(() => {
    // logout before we login so the useEffect gets called
    auth.logout();
    auth.login();
  }, []);

  return (
    <Container className="flex min-h-screen items-center">
      <h1 className="w-full text-center text-2xl text-text-grey">
        Redirecting...
      </h1>
    </Container>
  );
};

export default Login;
