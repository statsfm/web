<template>
  <Card class="text-[white]">
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="line-clamp-4">{{ description }}</p>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Card from "~/components/layout/Card.vue";

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
});
</script>
