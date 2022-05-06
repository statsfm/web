<template>
  <Card
    class="max-w-max cursor-pointer pb-2 pt-5"
    @click="router.push({ name: 'GiftCoupon', params: { code: giftcode.code } })"
  >
    <Badge @click="copyRedeemCode" class="w-full cursor-pointer">{{
      formatCode(giftcode.code)
    }}</Badge>
    <p v-if="giftcode.claimedDate" class="mt-3 text-center">
      Claimed {{ dayjs(giftcode.claimedDate).fromNow() }} by
      <Link
        :to="{ name: 'User', params: { userId: giftcode.claimedBy.id } }"
        class="font-bold text-white"
        >{{ giftcode.claimedBy.displayName }}</Link
      >
    </p>
    <p v-else class="mt-3 text-center">
      {{ t('coupon.purchased') }} {{ dayjs(giftcode.purchaseDate).fromNow() }}
    </p>
  </Card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import Card from '~/components/layout/Card.vue';
import Link from '~/components/base/Link.vue';
import Badge from '~/components/base/Badge.vue';

import { useI18n } from 'vue-i18n';
import { useStore } from '~/store';
import { GiftCode } from '~/types';
import dayjs from '~/dayjs';
import { useRouter } from 'vue-router';

const props = defineProps<{
  giftcode: GiftCode;
}>();

const { t } = useI18n();
const router = useRouter();

const formatCode = (code: string) => {
  return code.match(new RegExp('.{1,4}', 'g'))!.join('-');
};

const copyRedeemCode = () => {
  navigator.clipboard.writeText(props.giftcode.code);
};
</script>
