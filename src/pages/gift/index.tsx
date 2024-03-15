import type { GetServerSideProps, NextPage } from 'next';
import { Container } from '@/components/Container';
import type { FC } from 'react';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useApi, useAuth, useToaster } from '@/hooks';
import { Button } from '@/components/Button';
import type { Plan } from '@/types/gift';
import { Coupon } from '@/components/Gift/Coupon';
import { Title } from '@/components/Title';
import Link from 'next/link';
import type { ItemResponse, ItemsResponse, GiftCode } from '@/utils/statsfm';
import { useRemoteValue } from '@/hooks/use-remote-config';
import { MdInfo } from 'react-icons/md';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';

const Coupons: FC = () => {
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    (async () => {
      setGiftCodes(await api.me.getGiftCodes());
      setLoading(false);
    })();
  }, []);

  const [unClaimedCodes, claimedCodes] = useMemo(
    () => [
      giftCodes.filter((gc) => !gc.claimedBy),
      giftCodes.filter((gc) => gc.claimedBy),
    ],
    [giftCodes]
  );

  const loadingCheck = (type: string) =>
    !loading ? <p>You have no {type} coupons</p> : <p>Loading...</p>;

  return (
    <section className="mt-10">
      <h2 id="your-coupons">Your Coupons</h2>
      <div className="my-2">
        <h3 className="mb-3 text-lg">Unclaimed Coupons</h3>

        {unClaimedCodes.length > 0 ? (
          <ul className="flex flex-nowrap gap-3 overflow-x-auto pb-5 md:flex-wrap">
            {unClaimedCodes.map((gc) => (
              <Coupon key={gc.id} giftcode={gc} />
            ))}
          </ul>
        ) : (
          loadingCheck('unclaimed')
        )}

        <h3 className="mb-3 text-lg">Claimed Coupons</h3>
        {claimedCodes.length > 0 ? (
          <ul className="flex flex-nowrap gap-3 overflow-x-auto pb-5 md:flex-wrap">
            {claimedCodes.map((gc) => (
              <Coupon key={gc.id} giftcode={gc} />
            ))}
          </ul>
        ) : (
          loadingCheck('claimed')
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
        }x lifetime stats.fm Plus`,
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

export const getServerSideProps: GetServerSideProps<SSRProps<Props>> = async (
  ctx
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi();
  const { items } = await api.http.get<ItemsResponse<any>>(
    `/stripe/products/spotistats_plus_coupon/prices`
  );
  const plans = formatPlans(
    items.data.filter(
      (x: { product: string; active: boolean }) =>
        x.product === 'prod_Mveep2aVG09MSl' && x.active === true
    )
  );
  const user = await fetchUser(ctx);

  return {
    props: {
      plans,
      user,
    },
  };
};

const GiftPage: NextPage<Props> = ({ plans }) => {
  const toaster = useToaster();

  const giftNoticeText = useRemoteValue('gift_notice_text');
  const giftNoticeShow = useRemoteValue('gift_show_notice');

  const api = useApi();
  const { user, login } = useAuth();

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

      try {
        const { item } = await api.http.get<ItemResponse<{ url: string }>>(
          `/stripe/products/spotistats_plus_coupon/prices/${id}/session`,
          { authRequired: true }
        );
        window.location.href = item.url;
      } catch (e) {
        toaster.error('Something went wrong');
      }
    },
    [user]
  );

  return (
    <Container className="pt-32">
      <Title>Gift</Title>
      {giftNoticeShow?.asBoolean() && (
        <div className="my-8 w-full flex-row rounded-md border-l-4 border-l-yellow-400/80 bg-yellow-400/20 p-4">
          <div className="flex w-full flex-col">
            <span className="flex items-center gap-1">
              <MdInfo className="fill-white" />
              <h4>Warning</h4>
            </span>
            <span className="whitespace-pre-wrap text-white">
              {giftNoticeText?.asString()}
            </span>
          </div>
        </div>
      )}
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
              After finishing the checkout process, your coupons will be shown
              in <Link href="#your-coupons">the list below</Link>.
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
      {user && <Coupons />}
    </Container>
  );
};

export default GiftPage;
