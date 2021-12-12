<template>
  <p
    :class="{ truncate }"
    :style="{
      fontSize: `var(--size-${size})`,
      fontWeight: `var(--weight-${weight})`,
    }"
    :data-type="type"
  >
    <slot />
  </p>
</template>

<style lang="scss" scoped>
[data-type="secundary"] {
  color: var(--color-text-grey);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    size: {
      type: String,
      required: false,
      default: "xxs",
    },
    weight: {
      type: String,
      required: false,
      default: "medium",
    },
    type: {
      type: String,
      required: false,
      default: "primary",
      validation: (value: string) => {
        return value.match(/(primary|secundary)/);
      },
    },
    truncate: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
