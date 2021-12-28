<template>
  <CodeInput :maxLength="6" @code="onCodeInput" />
</template>

<script lang="ts" setup>
import api from '~/api';
import { useStore } from '~/store';
import { code } from './state';

import CodeInput from '~/components/base/CodeInput.vue';

const store = useStore();
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
