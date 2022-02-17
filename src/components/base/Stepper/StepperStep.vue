<template>
  {{ isDisabled }}
  <div
    class="flex flex-1 cursor-pointer flex-col items-center gap-2"
    @click="!isDisabled ? $emit('click') : ''"
  >
    <div
      class="grid aspect-square w-12 cursor-pointer select-none place-items-center rounded-full text-xl transition-colors duration-200"
      :class="{
        'bg-primaryLighter font-bold': isCurrent,
        'hover:bg-primary/20 active:bg-primary/5': !isDisabled
      }"
    >
      <span v-if="!isCompleted" class="text-primary">{{ index }}</span>
      <!-- TODO: use primary color -->
      <Icon v-else :path="mdiCheck" color="rgb(30 215 96)"></Icon>
    </div>
    <span class="truncate text-white">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
import Icon from '../Icon.vue';

import { mdiCheck } from '@mdi/js';

interface Props {
  index: number;
  isCurrent: boolean;
  isDisabled: boolean;
  isCompleted?: boolean;
}

withDefaults(defineProps<Props>(), {
  isDisabled: true,
  isCompleted: false
});
</script>
