<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import Card from '~/components/layout/Card.vue';
import { ToasterOptions } from '~/types/toaster';

interface Props {
  error: ToasterOptions;
}

const props = defineProps<Props>();

let isActive = ref(true);

onMounted(() => {
  setTimeout(() => {
    isActive.value = false;
  }, props.error.duration ?? 5 * 1000);
});
</script>

<template>
  <Card v-if="isActive" class="font-bold text-center animate-fade" :class="error.type">{{
    error.message
  }}</Card>
</template>

<style>
.error {
  @apply text-[#fc5353];
}

.success {
  @apply text-white;
}
</style>
