<template>
  <HeroWithImageAndInfo v-if="user" :name="user.displayName" :image="user.image" />
  <Container>
    <div class="flex gap-2 overflow-x-auto">
      <router-link
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
      ></router-link>
    </div>

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
import BacktrackApi from '~/api';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  BacktrackFriend,
  BacktrackRecentlyPlayedTrack,
  BacktrackTopArtist,
  GetFriendResponse,
  GetFriendStatsResponse,
  GetUserTopArtistsShortTermResponse
} from '~/types';

const route = useRoute();
const { t } = useI18n();

const user: Ref<BacktrackFriend | null> = ref(null);
const recentlyPlayed: Ref<BacktrackRecentlyPlayedTrack[] | null> = ref(null);
const topArtists: Ref<BacktrackTopArtist[] | null> = ref(null);

const getUser = async (id: string): Promise<BacktrackFriend> => {
  return await BacktrackApi.get<GetFriendResponse>(`/friends/get/${id}`).then(
    (res) => res.data.data
  );
};

const getUsersRecentlyPlayed = async (id: string): Promise<BacktrackRecentlyPlayedTrack[]> => {
  return await BacktrackApi.get<GetFriendStatsResponse>(`/friends/stats/${id}`).then(
    (res) => res.data.data.recentlyPlayed
  );
};

const getShortTermTopArtist = async (id: string): Promise<BacktrackTopArtist[]> => {
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
