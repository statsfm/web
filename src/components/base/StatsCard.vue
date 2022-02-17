<template>
  <Card class="h-max text-center">
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
