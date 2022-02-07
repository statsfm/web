<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-6" v-if="stats">
    <TotalStatsItem
      v-for="[key, item] in Object.entries(stats)"
      :label="labelMap[key]"
      :snapshot="item"
      hasIndicator
      :hasLiveIndicator="key === 'streams'"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApi } from '~/hooks';
import { GetStatsDatabaseSiteResponse, TotalSize } from '~/types';
import TotalStatsItem from './TotalStatsItem.vue';

const { t } = useI18n();
const api = useApi();

const labelMap: Record<string, string> = {
  users: t('total_stats.users'),
  plusUsers: t('total_stats.plus_users'),
  streams: t('total_stats.streams'),
  tracks: t('total_stats.tracks'),
  artists: t('total_stats.artists'),
  albums: t('total_stats.albums')
};

const stats: Ref<TotalSize | null> = ref(null);

const getStats = async (): Promise<TotalSize> => {
  return await api.stats.getDatabaseSize();
};

onMounted(async () => {
  stats.value = await getStats();
});
</script>
