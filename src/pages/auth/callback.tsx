import type { NextPage } from 'next';

import { useEffect } from 'react';
import { useToaster } from '@/hooks';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Callback: NextPage = () => {
  const router = useRouter();
  const toaster = useToaster();

  // checks if cookie is set
  useEffect(() => {
    const token = Cookies.get('identityToken');
    if (token) {
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
