<template>
  <textarea
    @input="(e: any) => $emit('input', e.target.value)"
    :value="value"
    :style="{ resize: isResizeable ? 'auto' : 'none' }"
    :placeholder="placeholder"
    class="bg-bodySecundary rounded-2xl p-5 w-full focus:outline-none"
  ></textarea>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    placeholder: {
      type: String,
      required: false,
    },
    isResizeable: {
      type: Boolean,
      default: true,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
  },
  emits: ["input"],
});
</script>
