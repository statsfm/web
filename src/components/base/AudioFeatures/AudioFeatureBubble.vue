<template>
  <div
    class="absolute aspect-square -translate-y-1/2 -translate-x-1/2 select-none resize-none rounded-full border-4 border-bodyPrimary bg-primary p-2"
    :style="{
      top: `${feature.point.y}px`,
      left: `${feature.point.x}px`
    }"
  >
    <Icon class="text-bodyPrimary" :path="feature.feature.icon" />
  </div>
</template>

<script lang="ts" setup>
import { Point } from '~/types/point';
import Icon from '../Icon.vue';
import { AudioFeature } from './feature';

defineProps<{
  feature: { point: Point; feature: AudioFeature };
}>();
</script>
