<template>
  <div class="relative" v-click-away="hide">
    <div @click="toggle">
      <slot name="button" :active="isActive" />
    </div>

    <!-- TODO: add fade out animtion -->
    <div
      :aria-hidden="isActive"
      class="mt-2 absolute w-max h-max right-0 shadow-xl z-50 animate-fadeIn"
      v-if="isActive"
      @click="hide"
      @keydown="onKeyDown"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Keys } from '~/types';

const isActive = ref(false);

const toggle = () => {
  isActive.value = !isActive.value;
};

const hide = () => {
  isActive.value = false;
};

const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case Keys.Escape:
      hide();
  }
};
</script>
