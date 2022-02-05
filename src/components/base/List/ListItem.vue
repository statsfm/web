<script lang="ts" setup>
import { useAttrs } from 'vue';
import { LocationAsRelativeRaw, RouterLink } from 'vue-router';

interface Props {
  to?: LocationAsRelativeRaw;
}

defineProps<Props>();

const attrs = useAttrs();
</script>

<template>
  <li
    v-bind="attrs"
    class="w-full flex px-4 py-2 cursor-pointer select-none hover:bg-bodyPrimary/80 focus:bg-bodyPrimary/80 text-white font-bold focus:outline-none"
    tabindex="0"
  >
    <RouterLink v-if="to" :to="to">
      <slot />
    </RouterLink>
    <slot v-else />
  </li>
</template>
