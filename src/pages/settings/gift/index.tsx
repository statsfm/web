import type { GetServerSideProps, NextPage } from 'next';
import type { FC } from 'react';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useApi, useAuth, useToaster } from '@/hooks';
import type { Plan } from '@/types/gift';
import { Coupon } from '@/components/Gift/Coupon';
import { Title } from '@/components/Title';
import Link from 'next/link';
import type { ItemResponse, ItemsResponse, GiftCode } from '@/utils/statsfm';
import { useRemoteValue } from '@/hooks/use-remote-config';
import { MdInfo } from 'react-icons/md';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import { AccountLayout } from '@/components/settings/Layout';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import clsx from 'clsx';
import { Button } from '@/components/Button';

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

const Gift: FC<Props> = ({ plans }) => {
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
    <div className="relative w-full">
      <SettingsHeader title="Gifts" />
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
        <div className="flex w-full flex-col justify-between">
          {plans.length > 0 ? (
            <div className="isolate mx-auto mb-2 mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none xl:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-3xl bg-foreground p-8 xl:p-10"
                >
                  <div className="flex items-center justify-between gap-x-4">
                    <h3
                      id={plan.id}
                      className="text-xl font-semibold leading-8 text-white"
                    >
                      {plan.name}
                    </h3>
                    {plan.isMostChosen ? (
                      <p className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                        Most chosen
                      </p>
                    ) : (
                      <p className="rounded-full px-2.5 py-1 text-xs font-semibold leading-5 text-transparent">
                        -
                      </p>
                    )}
                  </div>

                  <p className="mt-2 flex items-baseline gap-x-1">
                    <span className="text-lg font-bold tracking-tight text-white">
                      {formatAmount(plan.price.amount)}
                      {plan.price.currency}
                      <small className="ml-1">excl vat & fees</small>
                    </span>
                  </p>
                  {calculateSavePercentage(plan, plans[0]!) > 0 ? (
                    <p className="my-4 font-bold text-primary">
                      Save {calculateSavePercentage(plan, plans[0]!)}% with this
                      bundle!
                    </p>
                  ) : (
                    <p className="my-4 font-bold text-transparent">-</p>
                  )}
                  <div className="mt-auto flex flex-row gap-5 pt-4">
                    <Button
                      onClick={() => startCheckout(plan.id)}
                      className={clsx(
                        plan.isMostChosen
                          ? ''
                          : 'bg-white/10 text-white focus-visible:outline-white hover:bg-white/20',
                        'mt-6 block w-full rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                      )}
                    >
                      Buy plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              Loading...
            </div>
          )}
        </div>
      </section>
      <section>
        <h2>How does it work?</h2>
        <article className="prose max-w-full font-medium text-neutral-400 prose-headings:text-white prose-a:text-primary prose-li:my-0.5">
          <ol>
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
      <Coupons />
    </div>
  );
};

const GiftPage: NextPage<Props> = (props) => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <AccountLayout>
      <Gift {...props} />
    </AccountLayout>
  );
};

export default GiftPage;
