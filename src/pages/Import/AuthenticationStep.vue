<template>
  <h2>{{ t('import.authentication') }}</h2>
  <p>
    {{ t('import.authentication.description') }}
  </p>
  <CodeInput class="mt-2" :maxLength="6" @code="onCodeInput" />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import CodeInput from '~/components/base/CodeInput.vue';
import { useApi, useToaster } from '~/hooks';
import { PostImportCodeResponse } from '~/types';
import { code } from './state';

const toaster = useToaster();
const { t } = useI18n();
const api = useApi();
const emit = defineEmits(['setDisabledState']);

const onCodeInput = async (value: string) => {
  const { success } = await api.http.httpPost<PostImportCodeResponse>('/import/code', {
    body: JSON.stringify({ code: value })
  });

  if (success) {
    // TODO: set user with requested data
    code.value = value;
    emit('setDisabledState', false);
  }
};
</script>
