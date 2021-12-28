<template>
  <a v-if="typeof to == 'string' && to.startsWith('http')" :href="to"><slot /></a>
  <router-link v-else :to="to"><slot /></router-link>
</template>

<script lang="ts" setup>
import { LocationAsRelativeRaw } from 'vue-router';

defineProps<{
  to: string | LocationAsRelativeRaw;
}>();
</script>
