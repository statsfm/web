import type { NextPage } from 'next';

import { useEffect } from 'react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/router';

const Callback: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // TODO: look why router.params doesn't work
    const params = new URLSearchParams(window.location.search);

    if (params.has('code')) {
      const code = params.get('code');

      auth.callback(code!);
      router.back();
    } else {
      // TODO: show toaster error
      router.push('/login');
    }
  }, []);

  // TODO: show some loading ui
  return <></>;
};

export default Callback;
