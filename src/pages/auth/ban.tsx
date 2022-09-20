import type { NextPage } from 'next';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Ban: NextPage = () => {
  const router = useRouter();

  const [reason, setReason] = useState('');

  useEffect(() => {
    // TODO: look why router.params doesn't work
    const params = new URLSearchParams(window.location.search);

    if (!params.has('reason')) {
      // TODO: show toaster error
      router.push('/');
    }

    setReason(params.get('reason')!);
  }, []);

  // TODO: show some loading ui
  return (
    <>
      <div>reason: {reason}</div>
    </>
  );
};

export default Ban;
