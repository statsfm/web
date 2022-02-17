<template>
  <Header class="bg-bodySecundary" />
  <div class="bg-bodySecundary">
    <Container class="flex flex-col items-center gap-5 pt-24 pb-10 md:flex-row">
      <slot />
    </Container>
  </div>
</template>

<script lang="ts" setup>
import Header from '../layout/Header.vue';
import Container from '../layout/Container.vue';
</script>
