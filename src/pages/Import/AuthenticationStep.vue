<template>
  <h1 class="text-2xl font-bold">{{ t('import.authentication') }}</h1>
  <p class="font-medium text-textGrey">
    {{ t('import.authentication.description') }}
  </p>
  <CodeInput class="mt-2" :maxLength="6" @code="onCodeInput" />
</template>

<script lang="ts" setup>
import api from '~/api';
import { useStore } from '~/store';
import { code } from './state';

import CodeInput from '~/components/base/CodeInput.vue';
import { useI18n } from 'vue-i18n';

const store = useStore();
const { t } = useI18n();
const emit = defineEmits(['setDisabledState']);

const onCodeInput = async (value: string) => {
  const { data, success } = await api.post('/import/code', {
    body: JSON.stringify({ code: value })
  });

  if (!success) {
    store.commit('setError', { message: data.message, type: 'error' });
    return;
  }

  // TODO: set user with requested data

  code.value = value;
  emit('setDisabledState', false);
};
</script>
