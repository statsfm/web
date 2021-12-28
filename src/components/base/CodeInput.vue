<template>
  <input
    type="text"
    name="code"
    pattern="[A-Z,a-z,0-9]"
    :maxlength="maxLength"
    class="w-full bg-bodySecundary font-bold rounded-2xl text-3xl p-4 uppercase tracking-[0.15em]"
    v-model="input"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['code']);

const props = defineProps<{
  maxLength?: number;
  value?: string;
}>();

const input = ref('');

watch(
  () => props.value,
  (val) => {
    console.log(val);
  }
);

watch(input, (val) => {
  if (val.length == props.maxLength) {
    emit('code', val);
  }
});
</script>
