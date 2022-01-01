<template>
  <Link :to="to" class="flex items-center text-primary hover:text-primary/80"
    ><slot /><Icon :path="mdiChevronRight"
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
