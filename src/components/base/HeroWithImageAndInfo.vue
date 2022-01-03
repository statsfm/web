<template>
  <Hero>
    <Avatar :src="image" size="48" />
    <div class="flex flex-col justify-end">
      <span class="text-center md:text-left">{{ subtitle }}</span>
      <h1>{{ name }}</h1>
    </div>
  </Hero>
</template>

<script lang="ts" setup>
import Hero from './Hero.vue';
import Avatar from './Avatar.vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  name: string;
  subtitle?: string;
  image: string;
}>();

const { t } = useI18n();
</script>
