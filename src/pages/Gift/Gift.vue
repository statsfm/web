<template>
  <LoadingOverlay v-if="loading" />

  <Header />
  <Container class="pt-5">
    <!-- <Card class="mb-5">
      <h1 class="text-2xl font-bold">Holliday special 🎄</h1>
      <p>
        When purchasing a gift package, there's a 1% chance your package
        contents will be doubled
      </p>
      <h2 class="text-xl font-bold mt-2">Example</h2>
      <p>
        If you buy a package with 5 codes, and you're lucky, you'll receive 10
        codes instead of just 5
      </p>
    </Card> -->
    <h1 class="text-3xl font-bold">Gift Plus coupons</h1>

    <div class="flex gap-3 mb-5 flex-col">
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
      <h3 class="text-2xl font-bold">How does it work?</h3>
      <ol class="list-decimal pl-5">
        <li>Log in through Spotify</li>
        <li>Choose between one of the packages</li>
        <li>
          You'll be redirected to a secure
          <a
            class="text-primary font-bold"
            href="https://stripe.com"
            target="blank"
            >Stripe</a
          >
          checkout page
        </li>
        <li>
          After finishing the checkout process your coupons will be shown in the
          list below
        </li>
        <li>
          Share the giftcodes to your friends so they can redeem them at
          <router-link class="text-primary font-bold" :to="{ name: 'Redeem' }"
            >spotistats.app/redeem</router-link
          >
        </li>
      </ol>
    </div>
    <Divider class="pb-4" />
    <div>
      <h1 class="text-2xl font-bold">{{ t("gift.your_coupons") }}</h1>
      <p v-if="!auth.isLoggedIn()">
        Log in to view your previously purchased coupons
      </p>
      <div v-if="auth.isLoggedIn()">
        <p v-if="!giftCodes">Loading...</p>

        <div>
          <h3 class="text-l font-bold text-textGrey mb-2">
            {{ t("gift.unclaimed_coupons") }}
          </h3>
          <p
            v-if="
              giftCodes?.filter((code) => code.claimedBy == undefined)
                ?.length == 0
            "
          >
            {{ t("gift.coupon_codes_not_found") }}
          </p>

          <div class="flex flex-nowrap overflow-x-auto gap-3 md:flex-wrap">
            <Coupon
              v-for="(code, index) in giftCodes?.filter(
                (code) => code.claimedBy == undefined
              )"
              :key="index"
              :giftcode="code"
            />
          </div>
        </div>

        <div>
          <h3 class="text-l font-bold text-textGrey mb-2 mt-2">
            {{ t("gift.claimed_coupons") }}
          </h3>
          <p
            v-if="
              giftCodes?.filter((code) => code.claimedBy != undefined)
                ?.length == 0
            "
          >
            {{ t("gift.coupons_not_found") }}
          </p>

          <div class="flex flex-nowrap gap-3 overflow-x-auto md:flex-wrap">
            <Coupon
              v-for="(code, index) in giftCodes?.filter(
                (code) => code.claimedBy != undefined
              )"
              :key="index"
              :giftcode="code"
            />
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { ref, Ref, onBeforeMount } from "vue";

import Header from "~/components/layout/Header.vue";
import Container from "~/components/layout/Container.vue";
import Card from "~/components/layout/Card.vue";
import Divider from "~/components/base/Divider.vue";
import LoadingOverlay from "~/components/base/LoadingOverlay.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import Coupon from "~/components/base/Coupon.vue";
import PricePlanCard from "~/components/base/PricePlanCard.vue";

import api from "~/api";
import { useAuth } from "~/hooks/auth";
import { GiftCode, Plan } from "~/types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const auth = useAuth();
const giftCodes: Ref<GiftCode[] | null> = ref(null);
const loading = ref(false);
const plans: Plan[] = [
  {
    name: "1x lifetime Spotistats Plus",
    quantity: 1,
    price: "4$",
    isMostChosen: false,
  },
  {
    name: "3x lifetime Spotistats Plus",
    quantity: 3,
    price: "10$",
    isMostChosen: false,
  },
  {
    name: "5x lifetime Spotistats Plus",
    quantity: 5,
    price: "15$",
    isMostChosen: true,
  },
];

onBeforeMount(() => {
  listGiftCodes();
});

const listGiftCodes = async () => {
  giftCodes.value = await api
    .get("/plus/giftcodes/list")
    .then((res) => res.data.items);
  loading.value = false;
};

const initCheckout = async (quantity: number) => {
  loading.value = true;
  const session = await api
    .get(`/plus/giftcodes/purchase?quantity=${quantity}`)
    .then((res) => res.data.item);

  location.href = session.url;
};

const formatCode = (code: string): string => {
  return code.match(new RegExp(".{1,4}", "g"))!.join("-");
};
</script>
