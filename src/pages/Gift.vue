<template>
  <LoadingOverlay v-if="loading" />

  <Container>
    <div class="flex gap-3 mb-5 flex-col">
      <!-- <Card>
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
      </Card> -->

      <GiftStepper />
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

<script lang="ts">
import { defineComponent, ref, Ref, onBeforeMount } from "vue";

import Container from "~/components/layout/Container.vue";
import Card from "~/components/layout/Card.vue";
import Divider from "~/components/base/Divider.vue";
import LoadingOverlay from "~/components/base/LoadingOverlay.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import Coupon from "~/components/base/Coupon.vue";
import GiftStepper from "~/components/base/GiftStepper.vue";
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
    GiftStepper,
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

    return {
      auth,
      loading,
      giftCodes,
    };
  },
  methods: {
    formatCode(code: string) {
      return code.match(new RegExp(".{1,4}", "g"))!.join("-");
    },
  },
});
</script>
