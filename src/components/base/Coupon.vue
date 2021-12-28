<template>
  <Card class="max-w-max cursor-pointer" @click="showModal">
    <p class="mb-3"></p>
      {{ t("coupon.purchased") }} {{ dayjs(giftcode.purchaseDate).fromNow() }}
    </p>
    <Badge @click="copyRedeemLink" class="cursor-copy w-full">{{
      formatCode(giftcode.code)
    }}</Badge>
  </Card>

  <Modal v-if="isModalActive" @hide="hideModal">
    <h1 class="font-bold text-2xl">
      {{ t("coupon.coupon") }} {{ giftcode.id }}
    </h1>
    <Divider />
    <div class="flex flex-col gap-2">
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">{{
          t("coupon.purchased_on")
        }}</span>
        <span>{{ dayjs(giftcode.purchaseDate).format("L") }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">{{ t("coupon.bought_by") }}</span>
        <span>{{
          giftcode.boughtBy == user?.id ? "You" : giftcode.boughtBy
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">{{
          t("coupon.claimed_by")
        }}</span>
        <span>{{
          giftcode.claimedBy
            ? giftcode.claimedBy == user?.id
              ? "You"
              : giftcode.claimedBy
            : "-"
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">{{
          t("coupon.claimed_on")
        }}</span>
        <span>{{
          giftcode.claimedDate ? dayjs(giftcode.claimedDate).format("L") : "-"
        }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-textGrey font-bold">{{
          t("coupon.redeem_code")
        }}</span>
        <span>{{ formatCode(giftcode.code) }}</span>
      </div>
    </div>
    <Divider />
    <Button @click="copyRedeemLink">{{ t("buttons.copy_link") }}</Button>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue";

import Card from "~/components/layout/Card.vue";
import Text from "~/components/base/Text.vue";
import Badge from "~/components/base/Badge.vue";
import Modal from "./Modals/Modal.vue";
import Divider from "./Divider.vue";
import Button from "./Button.vue";

import { useI18n } from "vue-i18n";
import { useStore } from "~/store";
import { GiftCode } from "~/types";
import dayjs from "~/dayjs";
import { useRouter } from "vue-router";

const props = defineProps<{
  giftcode: GiftCode;
}>();

const { t } = useI18n();
const store = useStore();
const router = useRouter();

const user = store.state.user;
const isModalActive = ref(false);

const formatCode = (code: string) => {
  return code.match(new RegExp(".{1,4}", "g"))!.join("-");
};

const copyRedeemLink = () => {
  navigator.clipboard.writeText(
    `${window.location.origin}${
      router.resolve({
        name: "RedeemCode",
        params: { code: props.giftcode.code },
      }).fullPath
    }`
  );
};

const showModal = () => {
  isModalActive.value = true;
};

const hideModal = () => {
  isModalActive.value = false;
};
</script>
