<script lang="ts" setup>
import { computed, ref, useAttrs, watch } from 'vue';

interface Props {
  name?: string;
  description?: string;
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
  const val = (e.target as HTMLInputElement).value;
  value.value = val;
  emit('input', val);
};

const ariaValue = computed(() => `${props.prefix}${value.value}`);
</script>

<template>
  <label v-if="label" :for="name" class="text-lg font-bold text-neutral-400">{{ label }}</label>
  <div
    class="block w-full px-3 py-1 rounded-lg bg-bodySecundary text-white text-lg font-medium placeholder:text-neutral-600"
    :class="{ 'mt-1': label }"
  >
    <span v-if="prefix">{{ prefix }}</span>
    <textarea
      v-bind="attrs"
      :aria-label="name"
      :aria-valuetext="ariaValue"
      :name="name"
      @input="handleInput"
      class="w-full bg-transparent focus:outline-none"
      >{{ value }}</textarea
    >
  </div>
  <p v-if="description" class="mt-2 text-sm font-bold text-neutral-400">
    {{ description }}
  </p>
</template>
