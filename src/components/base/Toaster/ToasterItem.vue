<template>
  <Card
    v-if="isActive"
    class="font-bold text-center animate-fade"
    :class="{
      'text-[#fc5353]': error.type == 'error',
      'text-[wite]': error.type == 'info'
    }"
    >{{ error.message }}</Card
  >
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import Card from '~/components/layout/Card.vue';
import { Error } from '~/types';

const props = defineProps<{
  error: Error;
}>();

let isActive = ref(true);

onMounted(() => {
  setTimeout(() => {
    isActive.value = false;
  }, props.error.duration ?? 5 * 1000);
});
</script>
