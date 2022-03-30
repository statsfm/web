<script lang="ts" setup>
type Size = 'small' | 'medium' | 'large';
type Shape = 'round' | 'squared';

interface Props {
  size?: Size;
  src?: string;
  shape?: Shape;
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  shape: 'round'
});
</script>

<template>
  <div
    class="aspect-square bg-bodySecundary bg-cover bg-center"
    :class="[size, shape == 'round' ? 'rounded-full' : 'rounded-xl']"
    :style="src ? { backgroundImage: `url(${src})` } : {}"
  ></div>
</template>

<style scoped>
.small {
  @apply w-10;
}
.medium {
  @apply w-12;
}
.large {
  @apply w-48;
}
</style>
