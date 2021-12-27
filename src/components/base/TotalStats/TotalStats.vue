<template>
  <div class="grid grid-cols-2 gap-2" v-if="stats">
    <div>
      <TotalStatsItem label="Users" :current="stats.users" />
    </div>
    <TotalStatsItem label="Plus users" :current="stats.plusUsers" />
    <TotalStatsItem label="Streams" :current="stats.streams" />

    <TotalStatsItem label="Tracks" :current="stats.tracks" />
    <TotalStatsItem label="Artists" :current="stats.artists" />
    <TotalStatsItem label="Albums" :current="stats.albums" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import { TotalSize } from "~/types/totalStats";
import TotalStatsItem from "./TotalStatsItem.vue";

const stats: Ref<TotalSize | null> = ref(null);

const getStats = async (): Promise<TotalSize> => {
  // return await api.get("/stats/database/size").then((res) => res.data);
  return {
    users: {
      current: {
        count: 1189101,
        date: "2021-12-26T22:23:01.561Z",
      },
      previous: {
        count: 2189101,
        date: "2021-12-26T22:22:28.198Z",
      },
    },
    plusUsers: {
      current: {
        count: 1070227,
        date: "2021-12-26T22:23:01.561Z",
      },
      previous: {
        count: 1070227,
        date: "2021-12-26T22:22:28.198Z",
      },
    },
    streams: {
      current: {
        count: 389,
        date: "2021-12-26T22:23:01.561Z",
      },
      previous: {
        count: 29,
        date: "2021-12-26T22:22:28.198Z",
      },
    },
    tracks: {
      current: {
        count: 23425901,
        date: "2021-12-26T22:23:01.561Z",
      },
      previous: {
        count: 2142301,
        date: "2021-12-26T22:22:28.198Z",
      },
    },
    artists: {
      current: {
        count: 2559739,
        date: "2021-12-26T22:23:01.561Z",
      },
      previous: {
        count: 1559739,
        date: "2021-12-26T22:22:28.198Z",
      },
    },
    albums: {
      current: {
        count: 4047436,
        date: "2021-12-26T22:23:01.561Z",
      },
      previous: {
        count: 2047436,
        date: "2021-12-26T22:22:28.198Z",
      },
    },
  };
};

onMounted(async () => {
  stats.value = await getStats();
});
</script>
