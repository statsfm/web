<template>
  <article
    class="prose max-w-full text-gray-500 prose-headings:text-white prose-a:text-primary font-medium prose-li:my-1"
    v-html="marked(markdown)"
  />
</template>

<script lang="ts" setup>
import { marked } from 'marked';

defineProps<{
  markdown: string;
}>();
</script>
