<template>
  <div
    class="avatar"
    :class="`size-${size}`"
    :style="{ backgroundImage: `url(${src})` }"
    href="#"
  ></div>
</template>

<style lang="scss" scoped>
.avatar {
  background-color: var(--color-body-secundairy);
  border-radius: var(--radius-circle);
  background-position: center;
  background-size: cover;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    size: {
      type: String,
      default: "xxl",
    },
    src: {
      type: String,
      required: false,
    },
  },
});
</script>
