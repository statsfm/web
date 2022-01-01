<template>
  <Header />
  <Container class="h-screen flex flex-col items-center">
    <GiftCard
      :giftCode="giftCode"
      :isFlipped="isFlipped"
      @click="onGiftCardNotAuthenticatedClick"
      class="mt-24"
    />
    <Button class="max-w-xl" v-if="!auth.isLoggedIn()" @click="auth.login()">{{
      t('buttons.login')
    }}</Button>
    <Button class="max-w-xl" v-else @click="redeemGiftCode">{{ t('buttons.redeem') }}</Button>
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
import { useAuth, useToaster } from '~/hooks';

const { t } = useI18n();
const toaster = useToaster();
const router = useRouter();
const route = useRoute();
const auth = useAuth();

const giftCode: Ref<GiftCode | null> = ref(null);
const code = ref('');
const isFlipped = ref(false);

const getGiftCode = async (code: string) => {
  const res = await api.get(`/plus/giftcodes/${code}`);

  if (!res.success) {
    switch (res.status) {
      case 403:
        toaster.error({ message: t('errors.not_authenticated') });
        break;
      case 404:
        router.push({ name: 'Redeem' });
        toaster.error({ message: res.data.message });
        break;
    }

    return;
  }

  giftCode.value = res.data.item;
};

const redeemGiftCode = async () => {
  const res = await api.post(`/plus/giftcodes/${code.value}/redeem`);

  if (!res.success) {
    toaster.error({
      message: res.data.message
    });

    return;
  }

  toaster.success({
    message: t('errors.successfully_redeemed')
  });

  isFlipped.value = true;
};

const onGiftCardNotAuthenticatedClick = () => {
  toaster.error({
    message: t('errors.redeem_not_authenticated')
  });
};

onMounted(() => {
  code.value = route.params.code.toString();
  getGiftCode(code.value);
});
</script>
