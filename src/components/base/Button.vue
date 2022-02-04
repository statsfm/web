<script lang="ts" setup>
import { useAttrs } from 'vue';
import { LocationAsRelativeRaw } from 'vue-router';

type Variant = 'primary' | 'secundary';
type Size = 'small' | 'medium';

interface Props {
  variant: Variant;
  size: Size;
  to?: string | LocationAsRelativeRaw;
  full?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  full: false
});

const emit = defineEmits<{
  (event: 'click', e: MouseEvent): void;
}>();

const attrs = useAttrs();
</script>

<template>
  <button
    v-bind="attrs"
    class="whitespace-nowrap inline-flex items-center justify-center rounded-lg shadow-sm text-base font-bold"
    :class="[variant, size, { 'w-full': full, 'w-max': !full }]"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <slot />
  </button>
</template>

<style scoped>
/* variant */
.primary {
  @apply text-primary bg-primary/10 hover:bg-primary/20 active:bg-primary/5;
}
.secundary {
  @apply text-white hover:bg-bodySecundary/20 focus:ring-4 focus:ring-bodySecundary hover:text-white/90;
}

/* size */
.small {
  @apply py-2 px-5 rounded-xl;
}
.medium {
  @apply py-3 px-5 rounded-2xl;
}
</style>
