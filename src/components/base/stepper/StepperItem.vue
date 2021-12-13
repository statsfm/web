<template>
  <div class="flex items-center gap-3">
    <div
      class="
        text-primary
        bg-primaryLighter
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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    index: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
});
</script>
