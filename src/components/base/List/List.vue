<script lang="ts" setup>
import { useAttrs } from 'vue';

const attrs = useAttrs();
</script>

<template>
  <div class="flex flex-col py-2 bg-bodySecundary" v-bind="attrs">
    <slot />
  </div>
</template>
