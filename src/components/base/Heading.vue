<template>
  <component :is="`h${size}`" :class="{ truncate }" :data-type="type"
    ><slot
  /></component>
</template>

<style lang="scss" scoped>
[data-type="primary"] {
  color: var(--color-text-primary);
}

[data-type="secundary"] {
  color: var(--color-text-secundary);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    size: {
      type: Number,
      required: true,
      validation: (value: number) => {
        return value.toString().match(/(1|2|3|4|5|6)/);
      },
    },
    truncate: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "primary",
      validation: (value: string) => {
        return value.match(/(primary|secundary)/);
      },
    },
  },
});
</script>
