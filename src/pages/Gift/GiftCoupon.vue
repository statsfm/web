<template>
  <Modal v-if="giftCode" @hide="onModalHide">
    <h1>
      {{ t('coupon.coupon') }} <span class="text-neutral-400">#{{ giftCode.id }}</span>
    </h1>
    <div class="lg:w-30 mt-2 flex w-[90vw] flex-col gap-2 md:w-[60vw]">
      <div class="flex justify-between gap-5">
        <span>{{ t('coupon.purchased_on') }}</span>
        <span class="text-white">{{ dayjs(giftCode.purchaseDate).format('L') }}</span>
      </div>
      <div class="flex justify-between gap-5">
        <span>{{ t('coupon.bought_by') }}</span>
        <Link
          :to="{ name: 'User', params: { userId: giftCode.boughtBy.id } }"
          class="font-bold text-primary"
          >{{ giftCode.boughtBy.displayName }}</Link
        >
        <!-- <span class="text-white">{{
          giftCode.boughtById == user?.id ? 'You' : giftCode.boughtBy
        }}</span> -->
      </div>
      <div class="flex justify-between gap-5">
        <span>{{ t('coupon.claimed_by') }}</span>
        <!-- <span class="text-white">{{
          giftCode.claimedBy ? (giftCode.claimedBy == user?.id ? 'You' : giftCode.claimedBy) : '-'
        }}</span> -->
        <Link
          v-if="giftCode.claimedBy"
          :to="{ name: 'User', params: { userId: giftCode.claimedBy.id } }"
          class="font-bold text-primary"
          >{{ giftCode.claimedBy.displayName }}</Link
        >
        <span v-else class="text-white">-</span>
      </div>
      <div class="flex justify-between gap-5">
        <span>{{ t('coupon.claimed_on') }}</span>
        <span class="text-white">{{
          giftCode.claimedDate ? dayjs(giftCode.claimedDate).format('L') : '-'
        }}</span>
      </div>
      <div class="flex justify-between gap-5">
        <span>{{ t('coupon.redeem_code') }}</span>
        <span class="text-white">{{ formatCode(giftCode.code) }}</span>
      </div>
    </div>
    <div v-if="!giftCode.claimedBy" class="pt-4">
      <Textarea
        name="about"
        :label="t('gift.edit_message')"
        maxlength="512"
        rows="3"
        placeholder="Enter message"
        :value="giftCode.message"
        @input="(val: string) => (giftCode!.message = val)"
      />
    </div>
    <Button @click="onModalHide" class="w-full" :full="true" size="small">Save</Button>
    <Divider class="my-4" />
    <Button @click="copyRedeemLink" class="w-full" :full="true" size="small">{{ copyText }}</Button>
  </Modal>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import Divider from '~/components/base/Divider.vue';
import Link from '~/components/base/Link.vue';
import Textarea from '~/components/base/Textarea/Textarea.vue';
import Modal from '~/components/base/Modals/Modal.vue';
import { useApi, useToaster, useUser } from '~/hooks';
import { GiftCode } from '~/types';
import { giftCodes } from './state';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const user = useUser();
const toaster = useToaster();
const api = useApi();

const giftCode: Ref<GiftCode | null> = ref(null);
const copyText: Ref<string> = ref('Copy link');

const getGiftCode = async (code: string): Promise<GiftCode> => {
  return await api.http
    .get(`/me/plus/giftcodes/${code}`, { query: { type: 'code' } })
    .then((res) => res.data.item);
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
  if (giftCode.value) {
    const { data, success } = await api.http.put(`/me/plus/giftcodes/${giftCode.value?.id}`, {
      body: JSON.stringify({
        message: giftCode.value?.message
      })
    });

    if (!success) {
      toaster.error({
        // @ts-ignore
        message: data.message!
      });

      return;
    }
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
  copyText.value = 'Copied!';
  setTimeout(() => (copyText.value = 'Copy link'), 1000);
};
</script>
