<template>
  <HeroWithImageAndInfo
    v-if="album"
    :name="album.name"
    :image="album.image"
    :subtitle="album.artists.map((artist) => artist.name).join(', ')"
    :subtitle-to="{ path: `/artist/${album.artists[0].id}` }"
  />
  <Container>
    <div v-if="album" class="mt-5">
      <h1 class="text-3xl">{{ album.artists.length > 1 ? 'Artists' : 'Artist' }}</h1>
      <Image :src="album.image" />

      <h1 class="text-3xl">Album content</h1>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-2">
        <router-link
          :to="{ name: 'Track', params: { id: track.id } }"
          class="group relative"
          v-for="(track, index) in tracks"
          :key="index"
        >
          <div class="flex items-start">
            <span class="text-xl text-neutral-500 align-middle mt-3 w-8 pr-2 text-right"
              >{{ index + 1 }}.
            </span>
            <div class="mt-3 ml-2 flex justify-between">
              <div>
                <h3 class="text-xl text-white line-clamp-2">
                  {{ track.name }}
                </h3>
                <p class="mt-0 text-lg text-neutral-400 line-clamp-1">
                  <!-- TODO: move to a helper function -->
                  {{ track.artists.map((a) => a.name).join(', ') }}
                </p>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <div class="my-10"></div>

      <h1 class="text-3xl mb-3">Your {{ album?.name }} streams</h1>

      <ul class="w-full">
        <li v-for="(streams, key) in pairs" class="relative mb-6 w-full flex items-start">
          <div
            class="bg-bodySecundary rounded-full aspect-square min-w-[4rem] w-16 grid place-items-center"
          >
            <div class="flex flex-col items-center">
              <span class="text-neutral-400 text-sm font-medium block"
                >{{ dayjs(key).format('MMM') }}
              </span>
              <span class="text-primary relative -mt-1 text-2xl font-bold block">{{
                dayjs(key).format('D')
              }}</span>
            </div>
          </div>

          <div v-if="streams.length > 1">
            <span
              class="absolute top-0 left-8 h-full -z-10 w-[3px] rounded bg-neutral-700"
              aria-hidden="true"
            />
            <span
              class="absolute bottom-0 left-7 w-3 -z-10 h-6 bg-bodyPrimary"
              aria-hidden="true"
            />
            <span
              class="absolute bottom-6 left-8 w-5 -z-10 h-[3px] rounded bg-neutral-700"
              aria-hidden="true"
            />
          </div>

          <ul class="max-w-full ml-2 mt-2 flex flex-col justify-between gap-4 w-full" role="list">
            <li v-for="stream in streams">
              <RouterLink
                :to="{ name: 'Track', params: { id: stream.trackId } }"
                class="flex justify-between"
              >
                <div class="flex flex-col">
                  <h4>{{ stream.trackName }}</h4>

                  <span
                    >Streamed for
                    {{
                      dayjs
                        .duration({ milliseconds: stream.playedMs })
                        .add({ milliseconds: 0 }) // zonder dit werkt t niet lol
                        .format('mm:ss')
                    }}</span
                  >
                </div>

                <time
                  class="my-auto text-right text-sm whitespace-nowrap font-medium text-neutral-400"
                  >{{ dayjs(stream.endTime).fromNow() }}</time
                >
              </RouterLink>
            </li>
          </ul>
        </li>
        <Button
          size="small"
          id="dropdownButton"
          data-dropdown-toggle="dropdown"
          type="button"
          @click="loadStreams"
        >
          Load more streams

          <Icon :path="mdiChevronDown" />
        </Button>
      </ul>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { mdiChevronDown } from '@mdi/js';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import Button from '~/components/base/Button.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import Image from '~/components/base/Image.vue';
import Container from '~/components/layout/Container.vue';
import dayjs from '~/dayjs';
import { useApi } from '~/hooks';
import { BacktrackAlbum, BacktrackStream, BacktrackTrack } from '~/types/backtrack';

const { t } = useI18n();
const route = useRoute();
const api = useApi();

const id = parseInt(route.params.id.toString());

const album: Ref<BacktrackAlbum | null> = ref(null);
const tracks: Ref<BacktrackTrack[] | null> = ref(null);
const streams: Ref<BacktrackStream[] | null> = ref(null);

// TODO: move this to the helpers folder
const formatFollowers = (followers: number): string => {
  return followers.toLocaleString('en-US');
};

const pairs: Ref<Record<string, BacktrackStream[]>> = ref({});

const loadStreams = async () => {
  console.log({ limit: 100, offset: streams.value?.length ?? 0 });
  const newStreams = await api.users.getAlbumStreams('me', id, {
    query: { limit: 100, offset: streams.value?.length ?? 0 }
  });
  streams.value = [...(streams.value ?? []), ...newStreams];

  pairs.value = {};
  streams.value?.forEach((stream) => {
    const dm = dayjs(stream.endTime).format('LL');

    pairs.value[dm] = [...(pairs.value[dm] ?? []), stream];
  });
};

onMounted(async () => {
  album.value = await api.albums.get(id);
  tracks.value = await api.albums.tracks(id);
  loadStreams();
});
</script>
