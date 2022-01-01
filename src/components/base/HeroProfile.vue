<template>
  <Hero>
    <Avatar :src="image" :size="48" />
    <div class="flex flex-col justify-end">
      <span class="font-medium text-textGrey text-center md:text-left" v-if="followers">
        {{
          t('artist.followers', {
            count: formatFollowers(followers)
          })
        }}</span
      >
      <h1 class="text-4xl font-black text-center md:text-6xl">
        {{ name }}
      </h1>
    </div>
  </Hero>
</template>

<script lang="ts" setup>
import Hero from './Hero.vue';
import Avatar from './Avatar.vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  name: string;
  followers?: number;
  image: string;
}>();

const { t } = useI18n();

const formatFollowers = (followers: number): string => {
  return followers.toLocaleString('en-US');
};
</script>
