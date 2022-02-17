<template>
  <Card class="max-h-[200px] min-w-[400px] text-[white]">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="mt-2 line-clamp-3">{{ description }}</p>
    <div class="mt-3 flex justify-between font-bold text-textGrey">
      <span>{{ author }}</span>
      <span>{{ dayjs(date).fromNow() }}</span>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import Card from '~/components/layout/Card.vue';
import dayjs from '~/dayjs';

defineProps<{
  title: string;
  description: string;
  author: string;
  date: string;
}>();
</script>
