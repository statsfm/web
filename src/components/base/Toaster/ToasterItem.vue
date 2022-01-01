<template>
  <Card
    v-if="isActive"
    class="font-bold text-center animate-fade"
    :class="{
      'text-[#fc5353]': error.type == 'error',
      'text-wite': error.type == 'success'
    }"
    >{{ error.message }}</Card
  >
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import Card from '~/components/layout/Card.vue';
import { ToasterOptions } from '~/types/toaster';

const props = defineProps<{
  error: ToasterOptions;
}>();

let isActive = ref(true);

onMounted(() => {
  setTimeout(() => {
    isActive.value = false;
  }, props.error.duration ?? 5 * 1000);
});
</script>
