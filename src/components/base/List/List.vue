<script lang="ts" setup>
import { useAttrs } from 'vue';

const attrs = useAttrs();
</script>

<template>
  <ul class="flex flex-col gap-2 py-2 bg-bodySecundary" v-bind="attrs">
    <slot />
  </ul>
</template>
