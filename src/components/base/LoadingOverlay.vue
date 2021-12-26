<template>
  <div class="overlay">
    <Loading />
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
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: fade;
}
</style>

<script lang="ts" setup>
import Loading from "./Loading.vue";
</script>
