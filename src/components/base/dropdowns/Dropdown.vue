<template>
  <div class="dropdown">
    <div @click="toggle">
      <slot name="button" />
    </div>

    <transition name="dropdown">
      <Card class="content" v-if="isDropdownActive" v-click-away="onClickAway">
        <slot />
      </Card>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}

.content {
  padding: var(--space-s);
  background-color: var(--color-body-secundary);
  position: absolute;
  width: max-content;
  max-width: 350px;
  height: max-content;
  right: 0px;
  box-shadow: var(--shadow-xs);
  z-index: 1000;
  margin-top: var(--space-s);
  display: flex;
  flex-direction: column;
  transition: scale 0.2s;
  animation-name: fade-in;
  animation-duration: 0.2s;
}

.dropdown-leave-to {
  animation-name: fade-out;
  animation-duration: 0.2s;
  scale: 0.95;
}
</style>

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
