<template>
  <Link :to="to" class="flex items-center font-bold text-primary"
    ><slot /><Icon :path="mdiChevronRight" class="text-primary -ml-.5 hover:opacity-90"
  /></Link>
</template>

<script lang="ts" setup>
import Link from './Link.vue';
import Icon from './Icon.vue';
import { mdiChevronRight } from '@mdi/js';
import { LocationAsRelativeRaw } from 'vue-router';

defineProps<{
  to: string | LocationAsRelativeRaw;
}>();
</script>
