<template>
  <div
    class="bg-bodySecundary rounded-full bg-cover bg-center aspect-square"
    :class="`w-${size}`"
    :style="{ backgroundImage: `url(${src})` }"
    href="#"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    size: {
      type: Number,
      default: 12,
      required: false,
    },
    src: {
      type: String,
      required: false,
    },
  },
});
</script>
