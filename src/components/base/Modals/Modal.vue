<template>
  <Teleport to="body">
    <div
      class="fixed top-0 left-0 h-screen w-screen bg-black/40 grid place-items-center cursor-pointer animation-fade z-40"
    >
      <!-- TODO: add fade out animation -->
      <div
        class="bg-bodySecundary rounded-2xl max-h-max p-5 shadow-xl z-50 cursor-default animate-fadeIn"
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
