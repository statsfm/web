<template>
  <Header />
  <Container>
    <Markdown src="/privacy.md" class="mt-5" />
  </Container>
</template>

<script lang="ts" setup>
import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import Markdown from '~/components/base/Markdown/Markdown.vue';
</script>
