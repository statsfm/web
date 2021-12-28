<template>
  <article
    class="prose max-w-full prose-headings:text-white prose-a:text-primary prose-p:text-gray-500 font-medium prose-li:text-gray-500"
    v-html="marked(markdown)"
  />
</template>

<script lang="ts" setup>
import { marked } from 'marked';

defineProps<{
  markdown: string;
}>();
</script>
