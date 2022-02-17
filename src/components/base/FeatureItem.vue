<template>
  <div class="flex items-start gap-3">
    <div
      class="grid aspect-square min-w-[3rem] place-items-center rounded-full bg-primaryLighter text-xl font-bold text-primary"
    >
      <Icon :path="icon" color="#1ed760" />
    </div>
    <div class="flex flex-col align-middle">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <p class="text-neutral-400"><slot /></p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from './Icon.vue';

defineProps<{
  icon: string;
  title: string;
}>();
</script>
