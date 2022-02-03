<template>
  <HeroWithImageAndInfo
    v-if="artist"
    :name="artist.name"
    :subtitle="`${formatFollowers(artist.followers)} ${t('artist.followers')}`"
    :image="artist.image"
  />
  <Container>
    <div v-if="artist" class="mt-5">
      <h1 class="text-3xl">Genres</h1>
      <ChipGroup>
        <Link
          v-for="(genre, index) in artist.genres"
          :key="index"
          :to="{ name: 'Genre', params: { tag: genre } }"
        >
          <Chip>{{ genre }}</Chip>
        </Link>
      </ChipGroup>

      <div class="my-10"></div>

      <h1 class="text-3xl">Tracks by {{ artist.name }}</h1>
      <div class="mt-3 grid grid-cols-4 gap-y-3 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <div class="group relative" v-for="(track, index) in tracks?.slice(0, 6)" :key="index">
          <div
            class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden group-hover:opacity-75"
          >
            <img
              :src="track.albums[0].image"
              :alt="track.name"
              class="w-full h-full object-center object-cover lg:w-full lg:h-full"
            />
          </div>
          <div class="mt-3 flex justify-between">
            <div>
              <h3 class="text-lg text-white">
                <router-link :to="{ path: `/track/${track.id}` }">
                  {{ track.name }}
                </router-link>
              </h3>
              <p class="mt-0 text-sm text-neutral-400">
                {{ track.artists.map((a) => a.name).join(', ') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="my-10"></div>

      <h1 class="text-3xl">Your streams featuring {{ artist.name }}</h1>
      <div class="mt-4 flow-root">
        <ul role="list" class="-mb-8">
          <li v-for="(stream, index) in streams" :key="index">
            <div class="relative pb-8">
              <span
                v-if="streams && index !== streams.length - 1"
                class="absolute top-10 left-10 -ml-px h-full w-0.5 bg-neutral-600"
                aria-hidden="true"
              />
              <div class="relative flex space-x-3">
                <div>
                  <img
                    class="h-20 w-20 rounded-full flex items-center justify-center"
                    :src="artist.image"
                    alt=""
                  />
                </div>
                <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div class="flex h-full flex-col">
                    <router-link
                      :to="{ path: `/track/${stream.trackId}` }"
                      class="text-xl font-medium text-white mt-auto"
                      >{{ stream.trackName }}</router-link
                    >
                    <span class="text-lg text-neutral-400 mb-auto"
                      >{{ stream.playedMs }}ms played</span
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
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Chip from '~/components/base/Chip/Chip.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import Link from '~/components/base/Link.vue';
import Container from '~/components/layout/Container.vue';
import { useApi } from '~/hooks';
import { BacktrackArtist, BacktrackStream, BacktrackTrack } from '~/types/backtrack';

const { t } = useI18n();
const route = useRoute();
const api = useApi();

const artist: Ref<BacktrackArtist | null> = ref(null);
const tracks: Ref<BacktrackTrack[] | null> = ref(null);
const streams: Ref<BacktrackStream[] | null> = ref(null);

// TODO: move this to the helpers folder
const formatFollowers = (followers: number): string => {
  return followers.toLocaleString('en-US');
};

onMounted(async () => {
  const id = parseInt(route.params.id.toString());

  artist.value = await api.artists.get(id);
  tracks.value = await api.artists.tracks(id);
  streams.value = await api.users.getArtistStreams('me', id);
});
</script>
