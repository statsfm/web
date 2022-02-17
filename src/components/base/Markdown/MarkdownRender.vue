<template>
  <article
    class="prose max-w-full font-medium text-neutral-400 prose-headings:text-white prose-a:text-primary prose-li:my-0.5"
    v-html="marked(markdown)"
  />
</template>

<script lang="ts" setup>
import { marked } from 'marked';

defineProps<{
  markdown: string;
}>();
</script>
