<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-6" v-if="stats">
    <TotalStatsItem label="Users" :snapshot="stats.users" hasIndicator />
    <TotalStatsItem label="Plus users" :snapshot="stats.plusUsers" hasIndicator />
    <TotalStatsItem label="Streams" :snapshot="stats.streams" hasLiveIndicator hasIndicator />

    <TotalStatsItem label="Tracks" :snapshot="stats.tracks" hasIndicator />
    <TotalStatsItem label="Artists" :snapshot="stats.artists" hasIndicator />
    <TotalStatsItem label="Albums" :snapshot="stats.albums" hasIndicator />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import BacktrackApi from '~/api';
import { TotalSize, GetStatsDatabaseSiteResponse } from '~/types';
import TotalStatsItem from './TotalStatsItem.vue';

const stats: Ref<TotalSize | null> = ref(null);

const getStats = async (): Promise<TotalSize> => {
  return await BacktrackApi.get<GetStatsDatabaseSiteResponse>('/stats/database/size').then(
    (res) => res.data.items
  );
};

onMounted(async () => {
  stats.value = await getStats();
});
</script>
