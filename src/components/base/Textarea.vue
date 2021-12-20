<template>
  <div class="flex flex-col items-end">
    <textarea
      @input="onInput"
      :value="value"
      :style="{ resize: isResizeable ? 'auto' : 'none' }"
      :placeholder="placeholder"
      :maxlength="max"
      class="bg-bodySecundary rounded-2xl p-5 w-full focus:outline-none"
    ></textarea>
    <span v-if="max" class="text-xs text-textGrey font-bold"
      >{{ charCount }}/{{ max }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

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
    max: {
      type: Number,
      required: false,
    },
  },
  emits: ["input"],
  setup(props, { emit }) {
    const charCount = ref(0);

    const onInput = (e: any) => {
      const value = e.target.value;

      charCount.value = value.length;
      emit("input", value);
    };

    return { charCount, onInput };
  },
});
</script>
