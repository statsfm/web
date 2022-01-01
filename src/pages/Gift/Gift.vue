<template>
  <LoadingOverlay v-if="isLoading" />

  <Header />
  <Container class="pt-5">
    <section class="flex gap-3 mb-5 flex-col mt-2">
      <div class="w-full flex flex-col justify-between">
        <div class="flex gap-3 justify-center mb-2">
          <PricePlanCard
            v-for="(plan, index) in plans"
            :key="index"
            :plan="plan"
            @click="initCheckout(plan.quantity)"
          ></PricePlanCard>
        </div>
      </div>
      <h2>How does it work?</h2>
      <Markdown src="/gift_guide.md" />
    </section>
    <Divider />
    <div>
      <router-view />
      <h2>{{ t('gift.your_coupons') }}</h2>
      <p v-if="!auth.isLoggedIn()">Log in to view your previously purchased coupons</p>
      <div v-if="auth.isLoggedIn()">
        <p v-if="!giftCodes">Loading...</p>

        <div v-else>
          <div>
            <h4 class="my-2 text-neutral-400">
              {{ t('gift.unclaimed_coupons') }}
            </h4>
            <p v-if="giftCodes?.filter((code) => code.claimedBy == undefined)?.length == 0">
              {{ t('gift.coupon_codes_not_found') }}
            </p>

            <div class="flex flex-nowrap overflow-x-auto gap-3 md:flex-wrap">
              <Coupon
                v-for="(code, index) in giftCodes?.filter((code) => code.claimedBy == undefined)"
                :key="index"
                :giftcode="code"
              />
            </div>
          </div>

          <div>
            <h4 class="my-2 text-neutral-400">
              {{ t('gift.claimed_coupons') }}
            </h4>

            <p v-if="giftCodes?.filter((code) => code.claimedBy != undefined)?.length == 0">
              {{ t('gift.coupons_not_found') }}
            </p>

            <div class="flex flex-nowrap gap-3 overflow-x-auto md:flex-wrap">
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
import { ref, Ref, onBeforeMount } from 'vue';

import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import Divider from '~/components/base/Divider.vue';
import LoadingOverlay from '~/components/base/LoadingOverlay.vue';
import Coupon from '~/components/base/Coupon.vue';
import PricePlanCard from '~/components/base/PricePlanCard.vue';

import api from '~/api';
import { useAuth } from '~/hooks/auth';
import { GiftCode, Plan } from '~/types';
import { useI18n } from 'vue-i18n';
import { giftCodes } from './state';
import Markdown from '~/components/base/Markdown/Markdown.vue';
import { useToaster } from '~/hooks';

const { t } = useI18n();
const auth = useAuth();
const toaster = useToaster();

const isLoading = ref(false);
const plans: Plan[] = [
  {
    name: '1x lifetime Spotistats Plus',
    quantity: 1,
    price: '4$',
    isMostChosen: false
  },
  {
    name: '3x lifetime Spotistats Plus',
    quantity: 3,
    price: '10$',
    isMostChosen: false
  },
  {
    name: '5x lifetime Spotistats Plus',
    quantity: 5,
    price: '15$',
    isMostChosen: true
  }
];

onBeforeMount(async () => {
  giftCodes.value = await getGiftCodes();
});

const getGiftCodes = async (): Promise<GiftCode[]> => {
  return await api.get('/plus/giftcodes/list').then((res) => res.data.items);
};

const initCheckout = async (quantity: number) => {
  isLoading.value = true;
  const { data, status } = await api.get(`/plus/giftcodes/purchase?quantity=${quantity}`);

  if (status == 403) {
    isLoading.value = false;
    toaster.error({ message: t('errors.not_authenticated') });
    return;
  }

  location.href = data.item.url;
};

const formatCode = (code: string): string => {
  return code.match(new RegExp('.{1,4}', 'g'))!.join('-');
};
</script>
