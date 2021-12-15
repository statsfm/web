<template>
  <Card class="text-[white] min-w-[300px]">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="line-clamp-4 mt-2">{{ description }}</p>
    <div class="mt-2 text-textGrey font-bold flex justify-between">
      <span>{{ author }}</span>
      <span>{{ dayjs(date).fromNow() }}</span>
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Card from "~/components/layout/Card.vue";
import dayjs from "~/dayjs";

export default defineComponent({
  components: {
    Card,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { dayjs };
  },
});
</script>
