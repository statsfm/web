<script lang="ts" setup>
import { ref, useAttrs } from 'vue';

interface Props {
  label?: string;
  checked: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  checked: true
});

interface Emits {
  (event: 'checked', payload: boolean): void;
}

const emit = defineEmits<Emits>();

const value = ref(props.checked);

const toggle = () => {
  value.value = !value.value;
  emit('checked', value.value);
};
</script>

<template>
  <div class="m-2 flex cursor-pointer items-center" @click="toggle">
    <div
      class="h-6 w-11 rounded-full p-0.5 transition duration-200"
      :class="[value ? 'bg-primary' : 'bg-primary bg-opacity-30']"
    >
      <div
        class="h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out"
        :class="{ 'mx-auto translate-x-2': value }"
      ></div>
    </div>
    <label class="ml-2 text-sm font-semibold text-neutral-400">{{ label }}</label>
  </div>
</template>
