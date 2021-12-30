<template>
  <Modal v-if="giftCode" @hide="onModalHide">
    <h1 class="font-bold text-2xl">{{ t('coupon.coupon') }} {{ giftCode.id }}</h1>
    <Divider />
    <div class="flex flex-col gap-2">
      <div class="flex justify-between gap-5">
        <span class="text-textGrey font-bold">{{ t('coupon.purchased_on') }}</span>
        <span>{{ dayjs(giftCode.purchaseDate).format('L') }}</span>
      </div>
      <div class="flex justify-between gap-5">
        <span class="text-textGrey font-bold">{{ t('coupon.bought_by') }}</span>
        <span>{{ giftCode.boughtBy == user?.id ? 'You' : giftCode.boughtBy }}</span>
      </div>
      <div class="flex justify-between gap-5">
        <span class="text-textGrey font-bold">{{ t('coupon.claimed_by') }}</span>
        <span>{{
          giftCode.claimedBy ? (giftCode.claimedBy == user?.id ? 'You' : giftCode.claimedBy) : '-'
        }}</span>
      </div>
      <div class="flex justify-between gap-5">
        <span class="text-textGrey font-bold">{{ t('coupon.claimed_on') }}</span>
        <span>{{ giftCode.claimedDate ? dayjs(giftCode.claimedDate).format('L') : '-' }}</span>
      </div>
      <div class="flex justify-between gap-5">
        <span class="text-textGrey font-bold">{{ t('coupon.redeem_code') }}</span>
        <span>{{ formatCode(giftCode.code) }}</span>
      </div>
    </div>
    <div v-if="!giftCode.claimedBy">
      <Divider />
      <h2 class="text-xl font-bold">{{ t('gift.edit_message') }}</h2>
      <textarea
        v-model="giftCode.message"
        :placeholder="t('placeholders.enter_message')"
        class="mt-2 bg-transparent resize-none focus:outline-none"
      />
    </div>
    <Divider />
    <Button @click="copyRedeemLink">{{ t('buttons.copy_link') }}</Button>
  </Modal>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import Modal from '~/components/base/Modals/Modal.vue';
import Divider from '~/components/base/Divider.vue';
import Button from '~/components/base/Button.vue';

import { GiftCode } from '~/types';
import dayjs from 'dayjs';
import api from '~/api';
import { useUser } from '~/hooks';
import { useStore } from '~/store';
import { giftCodes } from './state';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const user = useUser();
const store = useStore();

const giftCode: Ref<GiftCode | null> = ref(null);

const getGiftCode = async (code: string): Promise<GiftCode> => {
  return await api.get(`/plus/giftcodes/${code}`).then((res) => res.data.item);
};

onMounted(async () => {
  const code = route.params.code.toString();
  const result = giftCodes.value?.find((giftCode) => giftCode.code == code);

  if (result) {
    giftCode.value = result;
  } else {
    giftCode.value = await getGiftCode(code);
  }
});

const formatCode = (code: string) => {
  return code.match(new RegExp('.{1,4}', 'g'))!.join('-');
};

const onModalHide = async () => {
  const { data, success } = await api.put(`/plus/giftcodes/${giftCode.value?.code}`, {
    body: JSON.stringify({
      message: giftCode.value?.message ?? ' ' // TODO: accept empty string
    })
  });

  if (!success) {
    store.commit('setError', {
      message: data.message,
      type: 'error'
    });

    return;
  }

  router.push({ name: 'Gift' });
};

const copyRedeemLink = () => {
  navigator.clipboard.writeText(
    `${window.location.origin}${
      router.resolve({
        name: 'RedeemCode',
        params: { code: giftCode.value?.code }
      }).fullPath
    }`
  );
};
</script>
