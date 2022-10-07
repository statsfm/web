import type { NextPage } from 'next';

import { useEffect } from 'react';
import { useAuth, useToaster } from '@/hooks';
import { useRouter } from 'next/router';

const Callback: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const toaster = useToaster();

  useEffect(() => {
    // TODO: look why router.params doesn't work
    const params = new URLSearchParams(window.location.search);

    if (params.has('code')) {
      const code = params.get('code');

      auth.callback(code!);
      const redirectUrl = localStorage.getItem('redirectUrl');

      if (redirectUrl) {
        router.push(redirectUrl);
        localStorage.removeItem('redirectUrl');
      } else router.push('/');
    } else {
      toaster.message('Something went wrong trying to login');
      router.push('/login');
    }
  }, []);

  // TODO: show some loading ui
  return <></>;
};

export default Callback;
