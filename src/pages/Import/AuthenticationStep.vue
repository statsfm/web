<template>
  <input
    type="text"
    name="code"
    pattern="[A-Z,a-z,0-9]{6}"
    maxlength="6"
    class="bg-bodySecundary font-bold rounded-2xl text-3xl p-4 uppercase tracking-[0.2em]"
    @input="onCodeInput"
  />
</template>

<script lang="ts" setup>
import api from '~/api';
import { useStore } from '~/store';
import { code } from './state';

const store = useStore();
const emit = defineEmits(['setDisabledState']);

const codeLength = 6;

const onCodeInput = async (e: any) => {
  const value = e.target.value;

  if (value.length == codeLength) {
    const { data, success } = await api.post('/import/code', {
      body: JSON.stringify({
        code: value
      })
    });

    if (!success) {
      store.commit('setError', { message: data.message, type: 'error' });
      return;
    }

    code.value = value;
    emit('setDisabledState', false);
  } else {
    emit('setDisabledState', true);
  }
};
</script>
