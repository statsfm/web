<template>
  <a
    v-if="typeof to == 'string' && to.startsWith('http')"
    :href="to"
    target="blank"
    class="min-w-max text-white hover:opacity-80"
    ><slot
  /></a>
  <router-link v-else :to="to" class="min-w-max text-white hover:opacity-80"><slot /></router-link>
</template>

<script lang="ts" setup>
import { LocationAsRelativeRaw } from 'vue-router';

defineProps<{
  to: string | LocationAsRelativeRaw;
}>();
</script>
