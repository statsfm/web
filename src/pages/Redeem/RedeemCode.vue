<template>
  <Header />
  <Container class="h-screen flex flex-col items-center">
    <GiftCard
      :giftCode="giftCode"
      :isFlipped="isFlipped"
      @flipped="isFlipped = $event"
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
import JSConfetti from 'js-confetti';
import { onMounted, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import GiftCard from '~/components/base/GiftCard.vue';
import Container from '~/components/layout/Container.vue';
import Header from '~/components/layout/Header.vue';
import { useApi, useAuth, useToaster } from '~/hooks';
import { GetPlusGiftCodeResponse, GiftCode, PostPlusGiftCodeRedeemResponse } from '~/types';

const { t } = useI18n();
const toaster = useToaster();
const router = useRouter();
const route = useRoute();
const auth = useAuth();
const api = useApi();

const giftCode: Ref<GiftCode | null> = ref(null);
const code = ref('');
const isFlipped = ref(false);

const getGiftCode = async (code: string) => {
  const res = await api.http.httpGet<GetPlusGiftCodeResponse>(`/plus/giftcodes/${code}`);

  if (res.status == 404) {
    router.push({ name: 'Redeem' });
    return;
  }

  giftCode.value = res.data.item;
};

watch(isFlipped, (val) => {
  if (val) {
    const confetti = new JSConfetti();
    confetti.addConfetti();
  }
});

const redeemGiftCode = async () => {
  const { success } = await api.http.httpPost<PostPlusGiftCodeRedeemResponse>(
    `/plus/giftcodes/${code.value}/redeem`
  );

  if (success) {
    toaster.success({
      message: t('errors.successfully_redeemed')
    });
  }

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
