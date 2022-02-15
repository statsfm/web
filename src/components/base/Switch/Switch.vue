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
  <div class="flex items-center m-2 cursor-pointer" @click="toggle">
    <div
      class="rounded-full w-11 h-6 p-0.5 transition duration-200"
      :class="[value ? 'bg-primary' : 'bg-primary bg-opacity-30']"
    >
      <div
        class="rounded-full w-5 h-5 bg-white transform transition duration-200 ease-in-out"
        :class="{ 'translate-x-2 mx-auto': value }"
      ></div>
    </div>
    <label class="font-semibold text-sm ml-2 text-neutral-400">{{ label }}</label>
  </div>
</template>
