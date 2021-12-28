<template>
  <Container class="flex flex-col gap-2 fixed left-0 bottom-5 right-0">
    <ToasterItem v-for="(error, index) in errors" :key="index" :error="error"
  /></Container>
</template>

<script lang="ts" setup>
import Container from '~/components/layout/Container.vue';
import ToasterItem from './ToasterItem.vue';

import { useStore } from '~/store';

const store = useStore();
const errors = store.state.errors;
</script>
