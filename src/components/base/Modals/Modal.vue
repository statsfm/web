<template>
  <div class="overlay" @click="$emit('hide')">
    <div class="bg-bodySecundary rounded-2xl sm:9/10 md:w-1/3 max-h-max p-5">
      <Container>
        <slot />
      </Container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: fade;
  cursor: pointer;
}
</style>

<script lang="ts" setup>
import Container from "~/components/layout/Container.vue";

const emit = defineEmits(["hide"]);

const hide = (e: Event) => {
  emit("hide", e);
};
</script>
