<template>
  <Header />
  <Loading v-if="loading" />

  <Container>
    <div class="flex gap-3 mb-5">
      <Card>
        <h1 class="text-2xl font-bold">Gift Plus coupons</h1>
        <Button v-if="!auth.isLoggedIn()" size="small" @click="auth.login()"
          >Log in through Spotify</Button
        >
        <Button @click="initCheckout(1)"> buy 1 giftcode </Button>
        <Button @click="initCheckout(3)"> buy 3 giftcodes </Button>
        <Button @click="initCheckout(5)"> buy 5 giftcodes </Button>
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

      <div class="flex flex-nowrap gap-3 overflow-x-scroll md:flex-wrap">
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

      <div class="flex flex-nowrap gap-3 overflow-x-scroll md:flex-wrap">
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

<script lang="ts">
import { defineComponent, ref, Ref, onBeforeMount } from "vue";

import Container from "~/components/layout/Container.vue";
import Header from "~/components/layout/Header.vue";
import Card from "~/components/layout/Card.vue";
import Heading from "~/components/base/Heading.vue";
import Divider from "~/components/base/Divider.vue";
import Loading from "~/components/base/Loading.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import Coupon from "~/components/base/Coupon.vue";
import api from "~/api";
import { useAuth } from "~/hooks/auth";
import { GiftCode } from "~/types";

export default defineComponent({
  components: {
    Container,
    Header,
    Card,
    Heading,
    Divider,
    Loading,
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
