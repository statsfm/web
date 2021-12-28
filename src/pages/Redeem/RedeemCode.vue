<template>
  <Header />
  <LoadingOverlay v-if="isLoading" />
  <Container class="h-screen flex flex-col items-center" v-if="giftCode">
    <GiftCard :giftCode="giftCode" :isFlipped="isFlipped" class="mt-24" />
    <Button class="max-w-xl" @click="redeemGiftCode">{{ t('buttons.redeem') }}</Button>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';

import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import GiftCard from '~/components/base/GiftCard.vue';
import { GiftCode } from '~/types';
import api from '~/api';
import { useRoute, useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '~/store';
import LoadingOverlay from '~/components/base/LoadingOverlay.vue';

const { t } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();

const giftCode: Ref<GiftCode | null> = ref(null);
const code = ref('');
const isLoading = ref(false);
const isFlipped = ref(false);

const getGiftCode = async (code: string) => {
  isLoading.value = true;
  const res = await api.get(`/plus/giftcodes/${code}`);

  if (!res.success) {
    // route back to the redeem page if gift code isn't found
    if (res.status == 404) {
      router.push({ name: 'Redeem' });
    }

    store.commit('setError', { message: res.data.message, type: 'error' });
    return;
  }

  giftCode.value = res.data.item;
  isLoading.value = false;
};

const redeemGiftCode = async () => {
  const res = await api.post(`/plus/giftcodes/${code.value}/redeem`);

  if (!res.success) {
    store.commit('setError', {
      message: res.data.message,
      type: 'error'
    });

    return;
  }

  store.commit('setError', {
    message: t('errors.successfully_redeemed'),
    type: 'info'
  });

  isFlipped.value = true;
};

onMounted(() => {
  code.value = route.params.code.toString();
  getGiftCode(code.value);
});
</script>
