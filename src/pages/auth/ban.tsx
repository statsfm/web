import type { GetServerSideProps, NextPage } from 'next';

import { useMemo } from 'react';
import { Container } from '@/components/Container';
import { ChevronLink } from '@/components/ChevronLink';
import { Title } from '@/components/Title';

type Props = {
  reason: string | null;
  bannedAt: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const reason = ctx.query.reason?.toString();
  const bannedAt = ctx.query.bannedAt?.toString() ?? null;

  if (!reason) {
    return {
      redirect: {
        destination: '/',
      },
      props: {
        reason: null,
        bannedAt: null,
      },
    };
  }

  return {
    props: {
      reason,
      bannedAt,
    },
  };
};

const Ban: NextPage<Props> = ({ reason, bannedAt }) => {
  const bannedAtFormatted = useMemo(() => {
    return bannedAt ? new Date(bannedAt).toLocaleString('eu') : 'Invalid Date';
  }, []);

  return (
    <>
      <Title>Banned</Title>
      <div className="bg-foreground pt-20">
        <Container>
          <section className="flex flex-col items-center gap-5 pb-10 pt-24 md:flex-row">
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
        <span className="text-base">{bannedAtFormatted}</span>
        <h3 className="mt-3">Reason</h3>
        <span className="text-base">{reason ?? 'No Reason Available'}</span>
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
