<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-6" v-if="stats">
    <TotalStatsItem label="Users" :item="stats.users" :ping="false" />
    <TotalStatsItem label="Plus users" :item="stats.plusUsers" :ping="false" />
    <TotalStatsItem label="Streams" :item="stats.streams" :ping="true" />

    <TotalStatsItem label="Tracks" :item="stats.tracks" :ping="false" />
    <TotalStatsItem label="Artists" :item="stats.artists" :ping="false" />
    <TotalStatsItem label="Albums" :item="stats.albums" :ping="false" />
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
        date: '2021-12-26T22:23:01.561Z'
      },
      previous: {
        count: 2189149,
        date: '2021-12-25T22:23:01.561Z'
      }
    },
    plusUsers: {
      current: {
        count: 85751,
        date: '2021-12-26T22:23:01.561Z'
      },
      previous: {
        count: 85451,
        date: '2021-12-25T22:23:01.561Z'
      }
    },
    streams: {
      current: {
        count: 1193989669,
        date: '2021-12-26T22:23:01.561Z'
      },
      previous: {
        count: 1191796851,
        date: '2021-12-25T22:23:01.561Z'
      }
    },
    tracks: {
      current: {
        count: 33523551,
        date: '2021-12-26T22:23:01.561Z'
      },
      previous: {
        count: 33456774,
        date: '2021-12-25T22:23:01.561Z'
      }
    },
    artists: {
      current: {
        count: 2639886,
        date: '2021-12-26T22:23:01.561Z'
      },
      previous: {
        count: 2634187,
        date: '2021-12-25T22:23:01.561Z'
      }
    },
    albums: {
      current: {
        count: 4666796,
        date: '2021-12-26T22:23:01.561Z'
      },
      previous: {
        count: 4656270,
        date: '2021-12-25T22:23:01.561Z'
      }
    }
  };
};

onMounted(async () => {
  stats.value = await getStats();
});
</script>
