<template>
  <HeroWithImageAndInfo
    v-if="artist"
    :name="artist.name"
    :subtitle="`${formatFollowers(artist.followers)} ${t('artist.followers')}`"
    :image="artist.image"
  />
  <Container>
    <div v-if="artist" class="mt-5">
      <h1 class="text-3xl mb-3">Genres</h1>
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
        <router-link
          :to="{ name: 'Track', params: { id: track.id } }"
          class="group relative"
          v-for="(track, index) in tracks?.slice(0, 6)"
          :key="index"
        >
          <div class="w-full min-h-80 group-hover:opacity-90">
            <Image :src="track.albums[0].image" :alt="track.name" />
          </div>
          <div class="mt-3 flex justify-between">
            <div>
              <h3 class="text-lg text-white line-clamp-2">
                {{ track.name }}
              </h3>
              <p class="mt-0 text-sm text-neutral-400 line-clamp-1">
                <!-- TODO: move to a helper function -->
                {{ track.artists.map((a) => a.name).join(', ') }}
              </p>
            </div>
          </div>
        </router-link>
      </div>

      <div class="my-10"></div>

      <h1 class="text-3xl mb-3">Your streams featuring {{ artist.name }}</h1>

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

          <span
            v-if="streams.length > 1"
            class="absolute top-0 left-8 h-full -z-10 w-[3px] rounded bg-neutral-700"
            aria-hidden="true"
          />

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
      </ul>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import dayjs from '~/dayjs';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, RouterLink } from 'vue-router';
import Chip from '~/components/base/Chip/Chip.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import Link from '~/components/base/Link.vue';
import Container from '~/components/layout/Container.vue';
import Image from '~/components/base/Image.vue';
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

const pairs: Ref<Record<string, BacktrackStream[]>> = ref({});

onMounted(async () => {
  const id = parseInt(route.params.id.toString());

  artist.value = await api.artists.get(id);
  tracks.value = await api.artists.tracks(id);
  streams.value = await api.users.getArtistStreams('me', id, { query: { limit: 100 } });

  streams.value?.forEach((stream) => {
    const dm = dayjs(stream.endTime).format('LL');

    pairs.value[dm] = [...(pairs.value[dm] ?? []), stream];
  });
});
</script>
