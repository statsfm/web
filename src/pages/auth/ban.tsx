import type { NextPage } from 'next';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container } from '@/components/Container';
import { ChevronLink } from '@/components/ChevronLink';

const Ban: NextPage = () => {
  const router = useRouter();

  const [reason, setReason] = useState('');
  const [bannedAt, setBannedAt] = useState(new Date());

  useEffect(() => {
    // TODO: look why router.params doesn't work
    const params = new URLSearchParams(window.location.search);

    if (!params.has('reason')) {
      // TODO: show toaster error
      router.push('/');
    }

    setReason(params.get('reason')!);
    setBannedAt(new Date(params.get('bannedAt')!));
  }, []);

  return (
    <>
      <div className="bg-bodySecundary pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
            <div className="flex flex-col justify-end">
              <h1 className="text-center text-5xl font-extrabold capitalize md:text-left">
                Banned
              </h1>
            </div>
          </section>
        </Container>
      </div>

      <Container className="mt-4">
        <h3>Banned at</h3>
        <span className="text-base">{bannedAt.toLocaleString()}</span>
        <h3 className="mt-3">Reason</h3>
        <span className="text-base">{reason}</span>
        <br />
        <br />
        <ChevronLink href="https://support.stats.fm/docs/banned">
          More info
        </ChevronLink>
      </Container>
    </>
  );
};

export default Ban;
