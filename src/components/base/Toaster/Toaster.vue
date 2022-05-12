<template>
  <Teleport to="body">
    <Container class="sticky left-0 bottom-5 right-0 flex flex-col gap-2 pb-10">
      <ToasterItem v-for="(error, index) in errors" :key="index" :error="error"
    /></Container>
  </Teleport>
</template>

<script lang="ts" setup>
import Container from '~/components/layout/Container.vue';
import ToasterItem from './ToasterItem.vue';

import { errors } from './state';
</script>
