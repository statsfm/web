<template>
  <div
    class="absolute bg-primary p-2 resize-none aspect-square -translate-y-1/2 -translate-x-1/2 rounded-full border-bodyPrimary border-4 select-none"
    :style="{
      top: `${feature.point.y}px`,
      left: `${feature.point.x}px`
    }"
  >
    <Icon :path="feature.feature.icon" />
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
