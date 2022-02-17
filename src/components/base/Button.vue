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
    class="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-bold shadow-sm"
    :class="[variant, size, { 'w-full': full, 'w-max': !full }]"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <slot />
  </button>
</template>

<style scoped>
/* variant */
.primary {
  @apply bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/5;
}
.secundary {
  @apply text-white hover:bg-bodySecundary/20 hover:text-white/90 focus:ring-4 focus:ring-bodySecundary;
}

/* size */
.small {
  @apply rounded-xl py-2 px-5;
}
.medium {
  @apply rounded-2xl py-3 px-5;
}
</style>
