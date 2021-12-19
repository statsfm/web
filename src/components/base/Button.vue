<template>
  <button
    class="
      w-full
      border-0
      cursor-pointer
      transition-colors
      duration-300
      font-bold
    "
    :class="{
      'bg-primary/10 hover:bg-primary/20 active:bg-primary/5 text-primary':
        type === 'primary',
      'py-2 px-5 rounded-xl': size === 'small',
      'py-3 px-5 rounded-2xl': size === 'medium',
      'bg-[#727272]/25 text-[#727272]': disabled,
    }"
    @click="(e) => $emit('click', e)"
  >
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
      default: "primary",
      validation: (value: string) => {
        return value.match(/(primary)/);
      },
    },
    size: {
      type: String,
      required: false,
      default: "medium",
      validation: (value: string) => {
        return value.match(/(small|medium)/);
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["click"],
});
</script>
