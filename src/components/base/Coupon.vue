<template>
  <Card class="max-w-max cursor-pointer" @click="showModal">
    <Text class="mb-3"
      >Purchased {{ dayjs(giftcode.purchaseDate).fromNow() }}</Text
    >
    <Badge @click="copyRedeemCode" class="cursor-copy w-full">{{
      formatCode(giftcode.code)
    }}</Badge>
  </Card>

  <Modal v-if="isModalActive" @hide="hideModal">
    <h1 class="font-bold text-2xl">Coupon {{ giftcode.id }}</h1>
    <Divider />
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">Purchased on</span>
        <span>{{ dayjs(giftcode.purchaseDate).format("L") }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">Bought by</span>
        <span>{{
          giftcode.boughtBy == user?.id ? "You" : giftcode.boughtBy
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">Claimed by</span>
        <span>{{
          giftcode.claimedBy
            ? giftcode.claimedBy == user?.id
              ? "You"
              : giftcode.claimedBy
            : "/"
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">Claimed date</span>
        <span>{{
          giftcode.claimedDate ? dayjs(giftcode.claimedDate).format("L") : "/"
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">Redeem code</span>
        <Badge @click="copyRedeemCode" class="cursor-copy w-full">{{
          formatCode(giftcode.code)
        }}</Badge>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";

import Card from "~/components/layout/Card.vue";
import Text from "~/components/base/Text.vue";
import Badge from "~/components/base/Badge.vue";
import Modal from "./Modals/Modal.vue";

import dayjs from "~/dayjs";
import { GiftCode } from "~/types";
import { useStore } from "~/store";
import Divider from "./Divider.vue";

export default defineComponent({
  components: {
    Card,
    Text,
    Badge,
    Modal,
    Divider,
  },
  props: {
    giftcode: {
      type: Object as PropType<GiftCode>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const user = store.state.user;
    const isModalActive = ref(false);

    const formatCode = (code: string) => {
      return code.match(new RegExp(".{1,4}", "g"))!.join("-");
    };

    const copyRedeemCode = () => {
      navigator.clipboard.writeText(props.giftcode.code);
    };

    const showModal = () => {
      isModalActive.value = true;
    };

    const hideModal = () => {
      isModalActive.value = false;
    };

    return {
      dayjs,
      user,
      formatCode,
      copyRedeemCode,
      isModalActive,
      showModal,
      hideModal,
    };
  },
});
</script>
