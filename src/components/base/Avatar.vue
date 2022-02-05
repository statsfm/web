<script lang="ts" setup>
type Size = 'small' | 'medium' | 'large';

interface Props {
  size?: Size;
  src?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'medium'
});
</script>

<template>
  <div
    class="bg-bodySecundary rounded-full bg-cover bg-center aspect-square"
    :class="size"
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
