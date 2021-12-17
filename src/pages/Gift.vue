<template>
  <LoadingOverlay v-if="loading" />

  <Container>
    <div class="flex gap-3 mb-5 flex-col md:flex-row">
      <Card>
        <h1 class="text-4xl font-bold">Gift Plus coupons</h1>
        <Button v-if="!auth.isLoggedIn()" size="small" @click="auth.login()"
          >Log in through Spotify</Button
        >
        <div class="flex flex-col md:flex-row gap-5">
          <div class="pricing-item bg-bodyPrimary">
            <p class="pricing-item-amount">1x</p>
            <span class="pricing-item-description">Lifetime Plus upgrade</span>
            <a @click="initCheckout(5)" href="#" class="pricing-item-buy">
              <span class="pricing-item-price">4$</span>
              <br />
              <span class="pricing-item-fees">incl vat/fees</span>
            </a>
          </div>
          <div class="pricing-item bg-bodyPrimary">
            <p class="pricing-item-amount">3x</p>
            <span class="pricing-item-description">Lifetime Plus upgrade</span>
            <a @click="initCheckout(3)" href="#" class="pricing-item-buy">
              <span class="pricing-item-price">10$</span>
              <br />
              <span class="pricing-item-fees">incl vat/fees</span>
            </a>
          </div>
          <div class="pricing-item bg-bodyPrimary">
            <span
              class="
                pricing-item-most-populair
                bg-primary
                text-bodyPrimary
                font-bold
              "
            >
              Most chosen
            </span>
            <p class="pricing-item-amount">5x</p>
            <span class="pricing-item-description">Lifetime Plus upgrade</span>
            <a @click="initCheckout(5)" href="#" class="pricing-item-buy">
              <span class="pricing-item-price">15$</span>
              <br />
              <span class="pricing-item-fees">incl vat/fees</span>
            </a>
          </div>
        </div>

        <Divider />
        <span class="text-textGrey"
          >Supported payment methods • All terms and conditions • Refund
          policy</span
        >
      </Card>
      <Card>
        <h1 class="text-2xl font-bold">Holliday special 🎄</h1>
        <Text
          >When purchasing a gift package, there's a 1% chance your package
          contents will be doubled</Text
        >
        <h2 class="text-xl font-bold mt-2">Example</h2>
        <Text
          >If you buy a package with 5 codes, and you're lucky, you'll receive
          10 codes instead of just 5</Text
        >
      </Card>
    </div>
    <div>
      <h1 class="text-2xl font-bold">Your coupons</h1>
      <Text v-if="!giftCodes">loading...</Text>
      <h3 class="text-l font-bold text-textGrey mb-2">Unclaimed coupons</h3>
      <Text
        v-if="
          giftCodes?.filter((code) => code.claimedBy == undefined)?.length == 0
        "
        >no codes found</Text
      >

      <div class="flex flex-nowrap overflow-x-auto gap-3 md:flex-wrap">
        <Coupon
          v-for="(code, index) in giftCodes?.filter(
            (code) => code.claimedBy == undefined
          )"
          :key="index"
          :giftcode="code"
        />
      </div>
      <h3 class="text-l font-bold text-textGrey mb-2 mt-2">Claimed coupons</h3>
      <Text
        v-if="
          giftCodes?.filter((code) => code.claimedBy != undefined)?.length == 0
        "
        >no codes found</Text
      >

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
  </Container>
</template>

<style lang="scss" scoped>
.pricing-item {
  height: 12.6rem;
  width: 11rem;
  border-radius: 1rem;
  position: relative;
  margin: 1rem 0px;
}

.pricing-item-buy {
  position: absolute;
  width: 8rem;
  text-align: center;
  border-radius: 0.5rem;
  bottom: -0.7rem;
  left: calc(11rem / 2 - 8rem / 2);
  background-color: rgb(26, 32, 24);
}

.pricing-item-price {
  text-align: center;
  font-size: 1.8em;
  font-weight: bold;
  line-height: 1;
  position: relative;
  bottom: -5px;
}
.pricing-item-fees {
  font-size: 0.8em;
  text-align: center;
  color: rgb(119, 112, 112);
  line-height: 1;
}
.pricing-item-amount {
  font-size: 4rem;
  text-align: center;
  position: absolute;
  width: 100%;
  font-weight: bold;
  top: 0.5rem;
}

.pricing-item-description {
  font-size: 1.3rem;
  text-align: center;
  position: absolute;
  width: 100%;
  font-weight: bold;
  top: 6rem;
  line-height: 1;
  color: rgb(119, 112, 112);
}
.pricing-item-most-populair {
  position: absolute;
  width: 7.5rem;
  text-align: center;
  border-radius: 0.5rem;
  top: -0.7rem;
  left: calc(11rem / 2 - 7.5rem / 2);
}
</style>

<script lang="ts">
import { defineComponent, ref, Ref, onBeforeMount } from "vue";

import Container from "~/components/layout/Container.vue";
import Card from "~/components/layout/Card.vue";
import Divider from "~/components/base/Divider.vue";
import LoadingOverlay from "~/components/base/LoadingOverlay.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import Coupon from "~/components/base/Coupon.vue";
import api from "~/api";
import { useAuth } from "~/hooks/auth";
import { GiftCode } from "~/types";

export default defineComponent({
  components: {
    Container,
    Card,
    Divider,
    LoadingOverlay,
    Text,
    Button,
    Coupon,
  },
  setup() {
    const auth = useAuth();
    const giftCodes: Ref<GiftCode[] | null> = ref(null);
    const loading = ref(false);

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

    return {
      auth,
      loading,
      giftCodes,
      initCheckout,
    };
  },
  methods: {
    formatCode(code: string) {
      return code.match(new RegExp(".{1,4}", "g"))!.join("-");
    },
  },
});
</script>
