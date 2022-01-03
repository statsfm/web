<template>
  <div v-if="track">
    <HeroWithImageAndInfo
      :name="track.name"
      :image="track.albums[0].image"
      :subtitle="track.artists.map((artist) => artist.name).join(', ')"
    />
  </div>
  <AudioAnalysis v-if="audioAnalysis" :analysis="audioAnalysis" />
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '~/api';
import auth from '~/auth';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import AudioAnalysis from '~/components/base/AudioAnalysis/AudioAnalysis.vue';

import { BacktrackAudioAnalysis, BacktrackTrack } from '~/types';

const route = useRoute();

const track: Ref<BacktrackTrack | null> = ref(null);
const audioAnalysis: Ref<BacktrackAudioAnalysis | null> = ref(null);

const getTrack = async (id: string): Promise<BacktrackTrack> => {
  return await api.get(`/tracks/${id}`).then((res) => res.data.item);
};

const getTrackAudioAnalysis = async (track: BacktrackTrack): Promise<BacktrackAudioAnalysis> => {
  const id = (track.externalIds.spotify as string[])[0];
  const token = await new auth().getSpotifyToken();

  return await fetch(`https://api.spotify.com/v1/audio-analysis/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json());
};

onMounted(async () => {
  const id = route.params.id.toString();

  track.value = await getTrack(id);
  audioAnalysis.value = await getTrackAudioAnalysis(track.value);
});
</script>
