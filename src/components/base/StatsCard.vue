<template>
  <Card class="text-center h-max">
    <h1 class="text-primary"><slot /></h1>
    <span class="text-white">{{ label }}</span>
  </Card>
</template>

<script lang="ts" setup>
import Card from '../layout/Card.vue';

defineProps<{
  label: string;
}>();
</script>
