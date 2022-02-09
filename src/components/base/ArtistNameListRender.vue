<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import * as statsfm from '@statsfm/statsfm.js';

interface Props {
  artists: statsfm.ArtistSimple[];
}

defineProps<Props>();
</script>

<template>
  <p class="mt-0 line-clamp-2">
    <RouterLink
      v-for="(artist, index) in artists"
      :to="{ name: 'Artist', params: { id: artist.id } }"
      >{{ artist.name }}<span v-if="index + 1 < artists.length">, </span></RouterLink
    >
  </p>
</template>
