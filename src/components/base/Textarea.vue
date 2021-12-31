<template>
  <div class="flex flex-col items-end">
    <textarea
      @input="onInput"
      :value="value"
      :style="{ resize: isResizeable ? 'vertical' : 'none' }"
      :placeholder="placeholder"
      :maxlength="maxLength"
      class="bg-bodySecundary rounded-2xl p-5 w-full focus:outline-none"
    ></textarea>
    <span v-if="maxLength" class="text-xs text-textGrey font-bold"
      >{{ charCount }}/{{ maxLength }}</span
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits(['input']);
defineProps<{
  placeholder?: string;
  isResizeable?: boolean;
  value?: string;
  maxLength?: number;
}>();

const charCount = ref(0);

const onInput = (e: any) => {
  const value = e.target.value;

  charCount.value = value.length;
  emit('input', value);
};
</script>
