<template>
  <Header />
  <Container>
    <h2 class="mb-5">Redeem a Plus coupon</h2>

    <input
      placeholder="XXXX-XXXX-XXXX"
      @input="code = ($event.target as any)?.value"
      :value="code"
      class="w-full rounded-2xl bg-bodySecundary p-4 text-3xl font-bold uppercase tracking-[0.15em]"
    />

    <Button @click="routeToCode" :disabled="isContinueButtonDisabled" class="mt-5">{{
      t('buttons.continue')
    }}</Button>
  </Container>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import Button from '~/components/base/Button.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const isContinueButtonDisabled = ref(true);
const code = ref('');

const segmentChars = 4;
const segmentCount = 3;
const totalCharLength = segmentChars * segmentCount + (segmentCount - 1);

watch(code, (newCode, oldCode) => {
  if (newCode.length == totalCharLength) {
    isContinueButtonDisabled.value = false;
  }

  if (newCode.length > 0) {
    if (!newCode[newCode.length - 1].match(/^[a-z0-9]+$/i)) {
      newCode = newCode.slice(0, newCode.length - 1);
    }
  }

  if (newCode.length > 0) {
    if (newCode.length < totalCharLength) {
      isContinueButtonDisabled.value = true;
    }

    if (newCode.length % (segmentChars + 1) == 0) {
      if (newCode.length >= oldCode.length) {
        newCode = newCode.slice(0, newCode.length - 1) + '-' + newCode[newCode.length - 1];
      } else {
        newCode = newCode.slice(0, newCode.length - 1);
      }
    }
  }

  code.value = newCode.substring(0, totalCharLength);
});

const routeToCode = () => {
  const parsed = code.value.split('-').join('');
  router.push({ name: 'RedeemCode', params: { code: parsed } });
};
</script>
