import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { useApi, useAuth, useToaster } from '@/hooks';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import type { GiftCode } from '@statsfm/statsfm.js';
import JSConfetti from 'js-confetti';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const RedeemCodePage: NextPage = () => {
  const router = useRouter();
  const api = useApi();
  const { user, login } = useAuth();

  const { code } = router.query as { code: string };

  const [giftCode, setGiftCode] = useState<GiftCode | null>(null);
  const [flipped, setFlipped] = useState(false);
  const toaster = useToaster();

  useEffect(() => {
    if (!code) return;
    (async () => {
      let giftCode: GiftCode;
      try {
        giftCode = await api.me.getGiftCode(code);
      } catch (e: any) {
        if (!user) return;
        router.push('/redeem');
        return;
      }

      setGiftCode(giftCode);
    })();
  }, [code]);

  const redeemGiftCode = useCallback(async () => {
    try {
      await api.me.redeemGiftCode(code);
    } catch (e: any) {
      toaster.error(e.message);
      return;
    }

    toaster.message('Succesfully redeemed gift code!');
  }, [code]);

  const redeemCallback = useCallback(async () => {
    if (!user) {
      toaster.error('You need to be logged in to claim a gift code');
      return;
    }

    if (flipped) setFlipped(false);
    else {
      setFlipped(true);
      new JSConfetti().addConfetti();
      redeemGiftCode();
    }
  }, [flipped, user]);

  return (
    <Container className="relative min-h-[80vh] pt-40">
      <div className="flex w-full flex-col items-center">
        <article
          onClick={redeemCallback}
          className="mb-5 flex aspect-[5/3] w-full max-w-xl cursor-pointer flex-col"
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative transition-transform duration-1000"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${flipped ? 180 : 0}deg)`,
            }}
          >
            <section
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
              className="absolute flex aspect-[5/3] max-h-max w-full items-center justify-center rounded-2xl bg-foreground bg-[url('/images/giftcard_pattern.svg')] bg-contain p-5"
            >
              <div className="text-center align-middle">
                <span className="text-2xl font-medium">Click to redeem</span>
              </div>
            </section>
            <section
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute flex aspect-[5/3] max-h-max w-full select-none flex-col justify-center rounded-2xl bg-foreground p-10"
            >
              {giftCode?.message ? (
                <p className="text-xl text-white">{giftCode.message}</p>
              ) : (
                <p className="text-xl font-normal text-white">No message</p>
              )}
              <span>
                Gifted by{' '}
                <Link legacyBehavior href={`/user/${giftCode?.boughtById}`}>
                  <a
                    className="font-bold text-primary hover:opacity-80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {giftCode?.boughtBy?.displayName}
                  </a>
                </Link>
              </span>
            </section>
          </div>
        </article>
        {user ? (
          <Button className="w-full max-w-xl" onClick={redeemCallback}>
            Redeem
          </Button>
        ) : (
          <Button
            className="w-full max-w-xl"
            onClick={() => login(`/redeem/${code}`)}
          >
            Login
          </Button>
        )}
      </div>
    </Container>
  );
};

export default RedeemCodePage;
