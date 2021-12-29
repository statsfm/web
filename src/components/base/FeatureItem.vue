<template>
  <div class="flex items-start gap-3">
    <div
      class="text-primary bg-primaryLighter min-w-[3rem] aspect-square rounded-full font-bold text-xl grid place-items-center"
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
