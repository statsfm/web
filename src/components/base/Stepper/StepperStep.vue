<template>
  {{ disabled }}
  <div
    class="flex flex-1 flex-col items-center gap-2 cursor-pointer"
    @click="!disabled ? $emit('click') : ''"
  >
    <div
      class="
        select-none
        cursor-pointer
        text-primary
        w-12
        aspect-square
        rounded-full
        text-xl
        grid
        place-items-center
        transition-colors
        duration-200
      "
      :class="{
        'bg-primaryLighter font-bold': isCurrent,
        'hover:bg-primary/20 active:bg-primary/5': !disabled,
      }"
    >
      {{ index }}
    </div>
    <span class="font-bold truncate">
      <slot />
    </span>
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
    isCurrent: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>
