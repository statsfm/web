<template>
  <a
    v-if="typeof to == 'string' && to.startsWith('http')"
    :href="to"
    target="blank"
    class="min-w-max text-base text-white hover:text-gray-300"
    ><slot
  /></a>
  <router-link v-else :to="to" class="min-w-max text-base text-white hover:text-gray-300"
    ><slot
  /></router-link>
</template>

<script lang="ts" setup>
import { LocationAsRelativeRaw } from 'vue-router';

defineProps<{
  to: string | LocationAsRelativeRaw;
}>();
</script>
