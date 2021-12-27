<template>
  <div
    class="
      fixed
      top-0
      left-0
      h-screen
      w-screen
      bg-black/40
      grid
      place-items-center
      cursor-pointer
      animation-fade
      z-50
    "
    @click="$emit('hide')"
  >
    <div class="bg-bodySecundary rounded-2xl max-h-max p-5 shadow-xl">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Container from "~/components/layout/Container.vue";
defineEmits(["hide"]);
</script>
