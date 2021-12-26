<template>
  <button
    class="
      w-full
      border-0
      cursor-pointer
      transition-colors
      duration-300
      font-bold
      bg-primary/10
      hover:bg-primary/20
      active:bg-primary/5
      text-primary
    "
    :class="{
      'py-2 px-5 rounded-xl': size === 'small',
      'py-3 px-5 rounded-2xl': size === 'medium',
      'bg-[#727272]/25 text-[#727272] hover:bg-[#727272]/25 active:bg-[#727272]/25':
        disabled,
    }"
    :disabled="disabled"
    @click="(e) => $emit('click', e)"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  type?: string;
  size?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: "medium",
});

defineEmits(["click"]);
</script>
