<template>
  <Teleport to="body">
    <div
      class="animation-fade fixed top-0 left-0 z-40 grid h-screen w-screen cursor-pointer place-items-center bg-black/40"
    >
      <!-- TODO: add fade out animation -->
      <div
        class="z-50 max-h-max animate-fadeIn cursor-default rounded-2xl bg-bodySecundary p-5 shadow-xl"
        v-click-away="onClickAway"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
const emit = defineEmits(['hide']);

const onClickAway = () => {
  emit('hide');
};
</script>
