<template>
  <svg
    width="24"
    height="24"
    viewport="0 0 24 24"
    :style="{ fill: color ?? 'currentColor' }"
  >
    <path :d="path" />
  </svg>
</template>

<script lang="ts" setup>
defineProps<{
  path: string;
  color?: string;
}>();
</script>
