<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-6" v-if="stats">
    <TotalStatsItem label="Users" :snapshot="stats.users" hasIndicator />
    <TotalStatsItem label="Plus users" :snapshot="stats.plusUsers" />
    <TotalStatsItem label="Streams" :snapshot="stats.streams" hasLiveIndicator />

    <TotalStatsItem label="Tracks" :snapshot="stats.tracks" />
    <TotalStatsItem label="Artists" :snapshot="stats.artists" />
    <TotalStatsItem label="Albums" :snapshot="stats.albums" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from 'vue';
import { TotalSize } from '~/types/totalStats';
import TotalStatsItem from './TotalStatsItem.vue';

const stats: Ref<TotalSize | null> = ref(null);

const getStats = async (): Promise<TotalSize> => {
  // return await api.get("/stats/database/size").then((res) => res.data);
  return {
    users: {
      current: {
        count: 2196279,
        date: '2021-12-29T01:04:22+0000'
      },
      previous: {
        count: 2189149,
        date: '2021-12-28T01:04:22+0000'
      }
    },
    plusUsers: {
      current: {
        count: 85451,
        date: '2021-12-29T01:04:22+0000'
      },
      previous: {
        count: 85751,
        date: '2021-12-28T01:04:22+0000'
      }
    },
    streams: {
      current: {
        count: 1193989669,
        date: '2021-12-29T01:04:22+0000'
      },
      previous: {
        count: 1191796851,
        date: '2021-12-28T01:04:22+0000'
      }
    },
    tracks: {
      current: {
        count: 33523551,
        date: '2021-12-29T01:04:22+0000'
      },
      previous: {
        count: 33456774,
        date: '2021-12-28T01:04:22+0000'
      }
    },
    artists: {
      current: {
        count: 2639886,
        date: '2021-12-29T01:04:22+0000'
      },
      previous: {
        count: 2634187,
        date: '2021-12-28T01:04:22+0000'
      }
    },
    albums: {
      current: {
        count: 4666796,
        date: '2021-12-29T01:04:22+0000'
      },
      previous: {
        count: 4656270,
        date: '2021-12-28T01:04:22+0000'
      }
    }
  };
};

onMounted(async () => {
  stats.value = await getStats();
});
</script>
