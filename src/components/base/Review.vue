<template>
  <Card class="text-[white] min-w-[400px] max-h-[200px]">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="line-clamp-3 mt-2">{{ description }}</p>
    <div class="mt-3 text-textGrey font-bold flex justify-between">
      <span>{{ author }}</span>
      <span>{{ dayjs(date).fromNow() }}</span>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import Card from "~/components/layout/Card.vue";
import dayjs from "~/dayjs";

const props = defineProps<{
  title: string;
  description: string;
  author: string;
  date: string;
}>();
</script>
