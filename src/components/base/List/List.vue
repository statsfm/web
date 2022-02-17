<script lang="ts" setup>
import { useAttrs } from 'vue';

const attrs = useAttrs();
</script>

<template>
  <ul class="flex flex-col gap-2 bg-bodySecundary py-2" v-bind="attrs">
    <slot />
  </ul>
</template>
