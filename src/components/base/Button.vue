<template>
  <button
    class="button"
    :class="['button', type, size]"
    @click="(e) => $emit('click', e)"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  width: 100%;
  border: 0;
  cursor: pointer;
  transition: background var(--duration-normal);
  font-weight: var(--weight-semi-bold);
}

.primary {
  background: var(--primary-button-bg);
  color: var(--primary-button-text);

  &:hover {
    background: var(--primary-button-bg-hover);
  }
  &:active {
    background: var(--primary-button-bg-active);
  }
}

.small {
  width: max-content;
  border-radius: var(--radius-small);
  padding: 8px 20px;
}

.medium {
  border-radius: var(--radius-default);
  padding: 12px 20px;
}
</style>

<script lang="ts">
// Import Vue
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
      default: "primary",
      validation: (value: string) => {
        return value.match(/(primary)/);
      },
    },
    size: {
      type: String,
      required: false,
      default: "medium",
      validation: (value: string) => {
        return value.match(/(small|medium)/);
      },
    },
  },
});
</script>
