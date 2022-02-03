<template>
  <HeroWithImageAndInfo
    v-if="user"
    :name="user.displayName"
    :subtitle="user.country"
    :image="user.image"
  />
  <Container>
    <div class="my-10"></div>
    <h1 class="text-3xl">Top tracks</h1>
    <div class="mt-3 grid grid-cols-4 gap-y-3 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
      <div class="group relative" v-for="(track, index) in topTracks?.slice(0, 6)" :key="index">
        <div
          class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden group-hover:opacity-75"
        >
          <img
            :src="track.track.albums[0].image"
            :alt="track.track.name"
            class="w-full h-full object-center object-cover lg:w-full lg:h-full"
          />
        </div>
        <div class="mt-3 flex justify-between">
          <div>
            <h3 class="text-lg text-white">
              <router-link :to="{ path: `/track/${track.track.id}` }">
                {{ track.track.name }}
              </router-link>
            </h3>
            <p class="mt-0 text-sm text-neutral-400">
              {{ track.track.artists.map((a) => a.name).join(', ') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="my-2"></div>

    <h1 class="text-3xl">Top artists</h1>
    <div class="mt-3 grid grid-cols-4 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
      <div class="group relative" v-for="(artist, index) in topArtists?.slice(0, 6)" :key="index">
        <div
          class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-full overflow-hidden group-hover:opacity-75"
        >
          <img
            :src="artist.artist.image"
            :alt="artist.artist.name"
            class="h-full w-full object-cover object-center"
          />
        </div>
        <div class="mt-2 text-center">
          <div>
            <h3 class="text-lg text-white">
              <router-link :to="{ path: `/artist/${artist.artist.id}` }">
                {{ artist.artist.name }}
              </router-link>
            </h3>
          </div>
        </div>
      </div>
    </div>

    <div class="my-10"></div>

    <h1 class="text-3xl">Recent streams</h1>
    <div class="mt-4 flow-root">
      <ul role="list" class="-mb-8">
        <li v-for="(stream, index) in recentStreams" :key="index">
          <div class="relative pb-8">
            <span
              v-if="recentStreams && index !== recentStreams.length - 1"
              class="absolute top-10 left-10 -ml-px h-full w-0.5 bg-neutral-600"
              aria-hidden="true"
            />
            <div class="relative flex space-x-3">
              <div>
                <img
                  class="h-20 w-20 rounded-lg flex items-center justify-center"
                  :src="stream.track.albums[0].image"
                  alt=""
                />
              </div>
              <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                <div class="flex h-full flex-col">
                  <router-link
                    :to="{ path: `/track/${stream.track.id}` }"
                    class="text-xl font-medium text-white mt-auto"
                    >{{ stream.track.name }}</router-link
                  >
                  <router-link
                    :to="{ path: `/artist/${stream.track.artists[0].id}` }"
                    class="text-lg text-neutral-400 mb-auto"
                    >{{ stream.track.artists.map((a) => a.name).join(', ') }}</router-link
                  >
                </div>
                <div
                  class="text-right text-sm whitespace-nowrap text-gray-500 flex h-full flex-col"
                >
                  <time class="my-auto" :datetime="stream.endTime.toLocaleString()">{{
                    stream.endTime
                  }}</time>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <h1>Streams</h1>
    <div v-for="(stream, index) in streams" :key="index">{{ stream.trackName }}</div>
  </Container>
  <!-- <Container>
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
  </Container> -->
</template>

<script lang="ts" setup>
import { useHead } from '@vueuse/head';
import { computed, onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import Container from '~/components/layout/Container.vue';
import { useApi } from '~/hooks';
import {
  BacktrackRecentlyPlayedTrack,
  BacktrackTopArtist,
  BacktrackTopTrack,
  BacktrackUser
} from '~/types';

const route = useRoute();
const { t } = useI18n();
const api = useApi();

const user: Ref<BacktrackUser | null> = ref(null);
const recentStreams: Ref<BacktrackRecentlyPlayedTrack[] | null> = ref(null);
const streams: Ref<any | null> = ref(null);
const topTracks: Ref<BacktrackTopTrack[] | null> = ref(null);
const topArtists: Ref<BacktrackTopArtist[] | null> = ref(null);

// TODO: remove hardcoded app name
const computedTitle = computed(() => `${user.value?.displayName ?? 'Backtrack'} | Backtrack`);

useHead({
  title: computedTitle.value,
  meta: [
    {
      name: 'og:title',
      content: computedTitle.value
    },
    {
      name: 'og:image',
      content: computed(() => user.value?.image)
    }
  ]
});

onMounted(async () => {
  const id = route.params.id.toString();
  user.value = await api.users.get(id);
  topTracks.value = await api.users.getTopTracks(id);
  topArtists.value = await api.users.getTopArtists(id);
  recentStreams.value = await api.users.getRecentStreams(id);
  streams.value = await api.users.getStreams(id);
});
</script>
