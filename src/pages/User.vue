<template>
  <HeroWithImageAndInfo
    v-if="user"
    :name="user.displayName"
    :subtitle="user.country"
    :image="user.image"
  />
  <Container>
    <h1 class="mt-10 mb-2">Top artists</h1>
    <div class="flex gap-2 overflow-x-auto" v-if="topArtists">
      <Link
        v-for="(artist, index) in topArtists"
        :key="index"
        :to="{
          name: 'Artist',
          params: {
            id: artist.artist.id,
            slug: artist.artist.name.toLowerCase().split(' ').join('-')
          }
        }"
      >
        <div
          :style="{ backgroundImage: `url(${artist.artist.image})` }"
          class="h-32 aspect-square bg-cover bg-center rounded-2xl"
        ></div
      ></Link>
    </div>

    <h1 class="mt-5 mb-2">Genres</h1>
    <AudioFeaturesRadarChart
      v-if="recentlyPlayed"
      :topTracks="recentlyPlayed.map((stream) => stream.track)"
    />
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';

import Container from '~/components/layout/Container.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import AudioFeaturesRadarChart from '~/components/base/AudioFeatures/AudioFeaturesRadarChart.vue';
import Link from '~/components/base/Link.vue';

import BacktrackApi from '~/api';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  BacktrackRecentlyPlayedTrack,
  BacktrackTopArtist,
  GetUserResponse,
  GetUserRecentlyplayedResponse,
  GetUserTopArtistsShortTermResponse,
  BacktrackUser
} from '~/types';

const route = useRoute();
const { t } = useI18n();

const user: Ref<BacktrackUser | null> = ref(null);
const recentlyPlayed: Ref<BacktrackRecentlyPlayedTrack[] | null> = ref(null);
const topArtists: Ref<BacktrackTopArtist[] | null> = ref(null);

const getUser = async (id: string) => {
  return await BacktrackApi.get<GetUserResponse>(`/users/${id}`).then((res) => res.data.item);
};

const getUsersRecentlyPlayed = async (id: string) => {
  return await BacktrackApi.get<GetUserRecentlyplayedResponse>(`/users/${id}/recentlyplayed`).then(
    (res) => res.data.items
  );
};

const getShortTermTopArtist = async (id: string) => {
  return await BacktrackApi.get<GetUserTopArtistsShortTermResponse>(
    `/users/${id}/top/artists/short_term`
  ).then((res) => res.data.items);
};

onMounted(async () => {
  const id = route.params.id.toString();
  user.value = await getUser(id);
  recentlyPlayed.value = await getUsersRecentlyPlayed(id);
  topArtists.value = await getShortTermTopArtist(id);
});
</script>
