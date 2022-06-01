<template>
  <Hero>
    <Avatar :src="image" size="md" />
    <div class="flex flex-col justify-end">
      <span class="text-center text-xl font-medium md:text-left">
        <router-link v-if="subtitleTo" :to="subtitleTo">
          {{ subtitle }}
        </router-link>
        <span v-else>{{ subtitle }}</span>
      </span>
      <h1 class="text-center md:text-left">{{ name }}</h1>
    </div>
  </Hero>
</template>

<script lang="ts" setup>
import Hero from './Hero.vue';
import { Avatar } from './Avatar';
import { useI18n } from 'vue-i18n';

defineProps<{
  name: string;
  subtitle?: string;
  image?: string;
  subtitleTo?: any;
}>();

const { t } = useI18n();
</script>
