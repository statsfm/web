<template>
  <h2>{{ t('import.authentication') }}</h2>
  <p>
    {{ t('import.authentication.description') }}
  </p>
  <CodeInput class="mt-2" :maxLength="6" @code="onCodeInput" />
</template>

<script lang="ts" setup>
import BacktrackApi from '~/api';
import { code } from './state';

import CodeInput from '~/components/base/CodeInput.vue';
import { useI18n } from 'vue-i18n';
import { useToaster } from '~/hooks';
import { PostImportCodeResponse } from '~/types';

const toaster = useToaster();
const { t } = useI18n();
const emit = defineEmits(['setDisabledState']);

const onCodeInput = async (value: string) => {
  const { success } = await BacktrackApi.post<PostImportCodeResponse>('/import/code', {
    body: JSON.stringify({ code: value })
  });

  if (success) {
    // TODO: set user with requested data
    code.value = value;
    emit('setDisabledState', false);
  }
};
</script>
