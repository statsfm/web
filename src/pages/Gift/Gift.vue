<template>
  <Header />
  <div
    class="py-50 fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70"
    style="z-index: 10000"
    v-if="loading"
  >
    <Loading class="m-auto" />
  </div>
  <Container class="pt-5">
    <section class="mb-5 mt-2 flex flex-col gap-3">
      <div v-if="plans" class="flex w-full flex-col justify-between">
        <div class="mb-2 flex flex-col justify-center gap-3 md:flex-row">
          <PricePlanCard
            v-for="(plan, index) in plans"
            :key="index"
            :plan="plan"
            :defaultPlan="plans[0]"
            @click="initCheckout(plan.id)"
          ></PricePlanCard>
        </div>
        <span>* you can redeem a coupon yourself or send the coupon to a friend</span>
      </div>
      <div v-else>
        <p>Loading prices...</p>
      </div>
      <br />
      <h2>How does it work?</h2>
      <Markdown src="/content/gift_guide.md" />
    </section>

    <div class="mt-10">
      <router-view />
      <h2>{{ t('gift.your_coupons') }}</h2>
      <p v-if="!auth.isLoggedIn()">Log in to view your previously purchased coupons</p>
      <div v-if="auth.isLoggedIn()">
        <p v-if="!giftCodes">Loading...</p>

        <div v-else>
          <div>
            <h4 class="my-2">
              {{ t('gift.unclaimed_coupons') }}
            </h4>
            <p v-if="giftCodes?.filter((code) => code.claimedBy == undefined)?.length == 0">
              {{ t('gift.coupon_codes_not_found') }}
            </p>

            <div class="flex flex-nowrap gap-3 overflow-x-auto pb-5 md:flex-wrap">
              <Coupon
                v-for="(code, index) in giftCodes?.filter((code) => code.claimedBy == undefined)"
                :key="index"
                :giftcode="code"
              />
            </div>
          </div>

          <div>
            <h4 class="my-2">
              {{ t('gift.claimed_coupons') }}
            </h4>

            <p v-if="giftCodes?.filter((code) => code.claimedBy != undefined)?.length == 0">
              {{ t('gift.coupon_codes_not_found') }}
            </p>

            <div class="flex flex-nowrap gap-3 overflow-x-auto pb-5 md:flex-wrap">
              <Coupon
                v-for="(code, index) in giftCodes?.filter((code) => code.claimedBy != undefined)"
                :key="index"
                :giftcode="code"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Coupon from '~/components/base/Coupon.vue';
import Divider from '~/components/base/Divider.vue';
import Markdown from '~/components/base/Markdown/Markdown.vue';
import Loading from '~/components/base/Loading.vue';
import PricePlanCard from '~/components/base/PricePlanCard.vue';
import Container from '~/components/layout/Container.vue';
import Header from '~/components/layout/Header.vue';
import { useApi, useToaster } from '~/hooks';
import { useAuth } from '~/hooks/auth';
import { GiftCode, Plan } from '~/types';
import { giftCodes } from './state';

const { t } = useI18n();
const auth = useAuth();
const toaster = useToaster();
const api = useApi();
const loading = ref(false);

const plans: Ref<Plan[] | undefined> = ref(undefined);

onBeforeMount(async () => {
  await getPrices();
  const opoep = await getGiftCodes();
  console.log(opoep);
  giftCodes.value = opoep;
});

const getGiftCodes = async (): Promise<GiftCode[]> => {
  return await api.http.get('/me/plus/giftcodes').then((res) => res.data.items);
};

const getPrices = async () => {
  const {
    data: {
      items: { data }
    },
    success
  } = await api.http.get(`/stripe/products/spotistats_plus/prices`);

  if (!success) return;

  plans.value = data
    .filter((price: any) => price.tax_behavior == 'exclusive')
    .sort((a: any, b: any) => a.unit_amount - b.unit_amount)
    .map((price: any) => {
      return {
        id: price.id,
        name: `${price.transform_quantity?.divide_by ?? 1}x lifetime Spotistats Plus`,
        quantity: price.transform_quantity?.divide_by ?? 1,
        price: {
          amount: price.unit_amount,
          currency: '$'
        },
        isMostChosen: price.transform_quantity?.divide_by == 5
      };
    });
};

const initCheckout = async (id: string) => {
  if (!auth.isLoggedIn()) {
    return auth.login();
  }
  loading.value = true;
  const { data, success } = await api.http.get(
    `/stripe/products/spotistats_plus/prices/${id}/session`
  );
  console.log(data);
  if (success) {
    location.href = data.item.url;
  } else {
    loading.value = true;
  }
};
</script>
