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
    class="flex w-full cursor-pointer select-none px-4 py-2 font-bold text-white hover:bg-bodyPrimary/80 focus:bg-bodyPrimary/80 focus:outline-none"
    tabindex="0"
    role="option"
  >
    <RouterLink v-if="to" :to="to">
      <slot />
    </RouterLink>
    <slot v-else />
  </li>
</template>
