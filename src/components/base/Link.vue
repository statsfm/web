<template>
  <a v-if="typeof to == 'string' && to.startsWith('http')" :href="to" class="min-w-max"><slot /></a>
  <router-link v-else :to="to" class="min-w-max"><slot /></router-link>
</template>

<script lang="ts" setup>
import { LocationAsRelativeRaw } from 'vue-router';

defineProps<{
  to: string | LocationAsRelativeRaw;
}>();
</script>
