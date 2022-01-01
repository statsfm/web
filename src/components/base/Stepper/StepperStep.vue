<template>
  {{ isDisabled }}
  <div
    class="flex flex-1 flex-col items-center gap-2 cursor-pointer"
    @click="!isDisabled ? $emit('click') : ''"
  >
    <div
      class="select-none cursor-pointer text-primary w-12 aspect-square rounded-full text-xl grid place-items-center transition-colors duration-200"
      :class="{
        'bg-primaryLighter font-bold': isCurrent,
        'hover:bg-primary/20 active:bg-primary/5': !isDisabled
      }"
    >
      <span v-if="!isCompleted">{{ index }}</span>
      <Icon v-else :path="mdiCheck"></Icon>
    </div>
    <span class="font-bold truncate">
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
