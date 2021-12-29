<template>
  {{ giftcode.id }}
  <Card
    class="max-w-max cursor-pointer"
    @click="router.push({ name: 'GiftCoupon', params: { code: giftcode.code } })"
  >
    <p class="mb-3">{{ t('coupon.purchased') }} {{ dayjs(giftcode.purchaseDate).fromNow() }}</p>
    <Badge @click="copyRedeemCode" class="cursor-copy w-full">{{
      formatCode(giftcode.code)
    }}</Badge>
  </Card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import Card from '~/components/layout/Card.vue';
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
