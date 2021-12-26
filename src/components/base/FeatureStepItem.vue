<template>
  <div class="flex items-center gap-3">
    <div
      class="
        text-primary
        bg-primaryLighter
        hover:
        w-12
        aspect-square
        rounded-full
        font-bold
        text-xl
        grid
        place-items-center
      "
    >
      {{ index }}
    </div>
    <div class="flex flex-col align-middle">
      <h2 class="text-2xl font-bold">{{ title }}</h2>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  index: number;
  title: string;
  description: string;
}>();
</script>
