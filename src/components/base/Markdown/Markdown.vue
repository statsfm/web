<template>
  <MarkdownRender :markdown="markdown" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import MarkdownRender from './MarkdownRender.vue';

const props = defineProps<{
  src: string;
}>();

const markdown = ref('');

onMounted(async () => {
  markdown.value = await fetch(props.src).then((res) => res.text());
});
</script>
