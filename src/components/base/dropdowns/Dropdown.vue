<template>
  <div class="relative" v-click-away="hide">
    <div @click="toggle">
      <slot name="button" />
    </div>

    <!-- TODO: add fade out animtion -->
    <Card
      :aria-hidden="isActive"
      class="absolute right-0 z-50 mt-2 h-max w-max animate-fadeIn shadow-xl"
      v-if="isActive"
      @click="hide"
    >
      <slot />
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Card from '~/components/layout/Card.vue';

const isActive = ref(false);

const toggle = () => {
  isActive.value = !isActive.value;
};

const hide = () => {
  isActive.value = false;
};
</script>
