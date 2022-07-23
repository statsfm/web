import type { NextPage } from 'next';
import { useAuth } from '@/hooks';
import { useEffect } from 'react';

const Login: NextPage = () => {
  const auth = useAuth();

  useEffect(() => {
    // logout before we login so the useEffect gets called
    auth.logout();
    auth.login();
  }, []);

  // TODO: login page ui
  return <p>redirecting to Spotify</p>;
};

export default Login;
