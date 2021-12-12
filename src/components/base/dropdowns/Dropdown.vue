<template>
  <div class="dropdown">
    <div @click="toggle">
      <slot name="button" />
    </div>

    <transition name="dropdown">
      <Card class="content" v-if="isDropdownActive">
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
  background-color: var(--color-body-primary);
  position: absolute;
  width: max-content;
  max-width: 350px;
  height: max-content;
  right: 0px;
  box-shadow: var(--shadow-xxl);
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

<script lang="ts">
import { defineComponent, ref } from "vue";

import Card from "~/components/layout/Card.vue";

export default defineComponent({
  components: {
    Card,
  },
  setup() {
    const isDropdownActive = ref(false);

    const toggle = () => {
      isDropdownActive.value = !isDropdownActive.value;
    };

    const onClickAway = () => {
      isDropdownActive.value = false;
    };

    return { isDropdownActive, toggle, onClickAway };
  },
});
</script>
