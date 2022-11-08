import type { GetStaticProps, NextPage } from 'next';
import { Container } from '@/components/Container';
import type { FC } from 'react';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useApi, useAuth, useToaster } from '@/hooks';
import { Button } from '@/components/Button';
import type { GiftCode, Plan } from '@/types/gift';
import { Coupon } from '@/components/gift/Coupon';
import { Title } from '@/components/Title';
import Link from 'next/link';

const Coupons: FC<{ giftCodes: GiftCode[] }> = ({ giftCodes }) => {
  const [unClaimedCodes, claimedCodes] = useMemo(
    () => [
      giftCodes.filter((gc) => !gc.claimedBy),
      giftCodes.filter((gc) => gc.claimedBy),
    ],
    [giftCodes]
  );

  return (
    <section className="mt-10">
      <h2>Your Coupons</h2>
      <div className="my-2">
        <h3 className="mb-3 text-lg">Unclaimed Coupons</h3>

        {unClaimedCodes ? (
          <ul className="flex flex-nowrap gap-3 overflow-x-auto pb-5 md:flex-wrap">
            {unClaimedCodes.map((gc) => (
              <Coupon key={gc.id} giftcode={gc} />
            ))}
          </ul>
        ) : (
          <p>You have no unclaimed coupons</p>
        )}

        <h3 className="mb-3 text-lg">Claimed Coupons</h3>
        {claimedCodes ? (
          <ul className="flex flex-nowrap gap-3 overflow-x-auto pb-5 md:flex-wrap">
            {claimedCodes.map((gc) => (
              <Coupon key={gc.id} giftcode={gc} />
            ))}
          </ul>
        ) : (
          <p>You have no claimed coupons</p>
        )}
      </div>
    </section>
  );
};

const formatPlans = (data: any[]): Plan[] => {
  return data
    .filter((price: any) => price.tax_behavior === 'exclusive')
    .sort((a: any, b: any) => a.unit_amount - b.unit_amount)
    .map((price: any) => {
      return {
        id: price.id,
        name: `${
          price.transform_quantity?.divide_by ?? 1
        }x lifetime Spotistats Plus`,
        quantity: price.transform_quantity?.divide_by ?? 1,
        price: {
          amount: price.unit_amount,
          currency: '$',
        },
        isMostChosen: price.transform_quantity?.divide_by === 5,
      };
    });
};

type Props = {
  plans: Plan[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi();

  const { data } = await api.http.get(
    `/stripe/products/spotistats_plus/prices`
  );
  const plans = formatPlans((data as any).items.data);

  return {
    props: {
      plans,
    },
  };
};

const GiftPage: NextPage<Props> = ({ plans }) => {
  const toaster = useToaster();
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);
  const api = useApi();
  const { user, login } = useAuth();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, success } = await api.http.get(`/me/plus/giftcodes`);

      if (!success) return;
      setGiftCodes((data as any).items as GiftCode[]);
    })();
  }, [user]);

  const calculateSavePercentage = useCallback(
    (plan: Plan, defaultPlan: Plan): number => {
      const defaultAmount = defaultPlan.price.amount * plan.quantity;
      const planAmount = plan.price.amount;
      return (
        Math.round(
          Math.abs(((planAmount - defaultAmount) / defaultAmount) * 100) * 10
        ) / 10
      );
    },
    []
  );

  const formatAmount = useCallback((amount: number): number => {
    return amount / 100;
  }, []);

  const startCheckout = useCallback(
    async (id: string) => {
      if (!user) {
        login();
        return;
      }

      const { data, success } = await api.http.get<{ url: string }>(
        `/stripe/products/spotistats_plus/prices/${id}/session`
      );

      if (success) window.location.href = data.item.url;
      else toaster.error('Something went wrong');
    },
    [user]
  );

  return (
    <Container className="pt-32">
      <Title>Gift</Title>
      <section className="mb-5 mt-2 flex flex-col gap-3">
        <div v-if="plans" className="flex w-full flex-col justify-between">
          {plans.length > 0 ? (
            <div className="mb-2 flex flex-col justify-center gap-3 md:flex-row">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className="relative w-full cursor-pointer select-none transition duration-200 hover:scale-105"
                  onClick={() => startCheckout(plan.id)}
                >
                  <div className="flex max-h-max w-full flex-col items-center rounded-2xl bg-foreground p-5 py-3 text-center">
                    {plan.isMostChosen && (
                      <div className="absolute top-0 -translate-y-1/2 select-none rounded-lg bg-primary px-3">
                        <span className="font-medium text-foreground">
                          Most chosen
                        </span>
                      </div>
                    )}
                    <h1>{plan.quantity}x</h1>
                    <p>{plan.name}</p>
                    <p className="my-[-3px] font-bold text-primary">
                      {calculateSavePercentage(plan, plans[0]!) > 0 ? (
                        <>
                          Save {calculateSavePercentage(plan, plans[0]!)}% with
                          this bundle!
                        </>
                      ) : (
                        <span className="text-transparent">-</span>
                      )}
                    </p>
                  </div>
                  <Button className="mt-2 w-full rounded-xl py-2 text-sm">
                    {formatAmount(plan.price.amount)}
                    {plan.price.currency}
                    <small className="ml-1">excl vat & fees</small>
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              Loading...
            </div>
          )}
          <span>
            * you can redeem a coupon yourself or send the coupon to a friend
          </span>
        </div>
      </section>
      <section>
        <h2>How does it work?</h2>
        <article className="prose max-w-full font-medium text-neutral-400 prose-headings:text-white prose-a:text-primary prose-li:my-0.5">
          <ol>
            <li>Log in if you arent&apos;t already</li>
            <li>Choose between one of the packages</li>
            <li>
              You&apos;ll be redirected to a secure{' '}
              <a href="https://stripe.com">Stripe</a> checkout page
            </li>
            <li>
              After finishing the checkout process your coupons will be shown in
              the list below
            </li>
            <li>
              If you want to claim the Plus yourself, you can enter it yourself
              at{' '}
              <Link legacyBehavior href="/redeem">
                stats.fm/redeem
              </Link>
            </li>
            <li>
              You can send the other coupons to your friends so they can redeem
              them at{' '}
              <Link legacyBehavior href="/redeem">
                stats.fm/redeem
              </Link>
            </li>
          </ol>
        </article>
      </section>
      {user && giftCodes && <Coupons giftCodes={giftCodes} />}
    </Container>
  );
};

export default GiftPage;
