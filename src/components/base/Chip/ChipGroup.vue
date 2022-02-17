<template>
  <ul class="flex flex-nowrap gap-2 overflow-x-auto" @wheel.prevent="onWheelScroll" ref="chipgroup">
    <slot />
  </ul>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue';

const chipgroup: Ref<HTMLDivElement | undefined> = ref();

const onWheelScroll = (e: WheelEvent) => {
  if (chipgroup.value) {
    chipgroup.value.scrollLeft += e.deltaY || e.deltaX; // deltaX for trackpads
  }
};
</script>
