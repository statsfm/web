<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';

interface Props {
  name?: string;
  description?: string;
  validation?: string | null;
  label?: string;
  prefix?: string;
}

const props = defineProps<Props>();

interface Emits {
  (event: 'input', value: string): void;
}

const emit = defineEmits<Emits>();

const attrs = useAttrs();
const value = ref(attrs.value ?? '');

const handleInput = (e: Event) => {
  emit('input', (e.target as HTMLInputElement).value);
};

const ariaValue = computed(() => `${props.prefix}${value.value}`);
</script>

<template>
  <label v-if="label" :for="name" class="text-lg font-bold text-white">{{ label }}</label>
  <div
    class="py-2 px-4 w-full rounded-lg bg-bodySecundary text-white text-lg font-bold placeholder:text-neutral-600 flex items-center"
    :class="{ 'mt-1': label }"
  >
    <span v-if="prefix">{{ prefix }}</span>
    <input
      :aria-label="name"
      :aria-valuetext="ariaValue"
      :name="name"
      v-model="value"
      @input="handleInput"
      class="w-full bg-transparent focus:outline-none"
    />
  </div>
  <p v-if="validation" class="mt-2 text-sm font-bold text-red-500">
    {{ validation }}
  </p>
  <p v-else class="mt-2 text-sm font-bold text-neutral-400">
    {{ description }}
  </p>
</template>
