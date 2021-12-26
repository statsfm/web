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
    <div
      class="
        bg-bodySecundary
        rounded-2xl
        sm:9/10
        md:w-1/3
        max-h-max
        p-5
        shadow-xl
      "
    >
      <Container>
        <slot />
      </Container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Container from "~/components/layout/Container.vue";
defineEmits(["hide"]);
</script>
