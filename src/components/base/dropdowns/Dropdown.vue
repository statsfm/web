<template>
  <div class="relative">
    <div @click="toggle">
      <slot name="button" />
    </div>

    <!-- TODO: add fade out animtion -->
    <Card
      class="mt-2 absolute w-max h-max right-0 shadow-xl z-50 animate-fadeIn"
      v-if="isDropdownActive"
      v-click-away="onClickAway"
    >
      <slot />
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import Card from '~/components/layout/Card.vue';

const isDropdownActive = ref(false);

const toggle = () => {
  isDropdownActive.value = !isDropdownActive.value;
};

const onClickAway = () => {
  isDropdownActive.value = false;
};
</script>
