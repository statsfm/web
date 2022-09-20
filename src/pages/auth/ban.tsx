import type { NextPage } from 'next';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Ban: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // TODO: look why router.params doesn't work
    const params = new URLSearchParams(window.location.search);

    if (params.has('reason')) {
      // const reason = params.get('reason');
    } else {
      // TODO: show toaster error
      router.push('/');
    }
  }, []);

  // TODO: show some loading ui
  return (
    <>
      <div>reason</div>
    </>
  );
};

export default Ban;
