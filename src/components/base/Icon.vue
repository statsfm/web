<template>
  <svg width="24" height="24" viewport="0 0 24 24" class="fill-icon" :style="{ fill: color }">
    <path :d="path" />
  </svg>
</template>

<script lang="ts" setup>
defineProps<{
  path: string;
  color?: string;
}>();
</script>
