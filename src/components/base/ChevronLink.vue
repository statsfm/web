<template>
  <Link :to="to" class="text-primary font-bold flex items-center"
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
