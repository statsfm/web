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
              <h3 class="text-lg text-white">
                {{ track.name }}
              </h3>
              <p class="mt-0 text-sm text-neutral-400">
                <!-- TODO: move to a helper function -->
                {{ track.artists.map((a) => a.name).join(', ') }}
              </p>
            </div>
          </div>
        </router-link>
      </div>

      <div class="my-10"></div>

      <h1 class="text-3xl">Your streams featuring {{ artist.name }}</h1>
      <div class="mt-4 flow-root">
        <ul role="list" class="-mb-8">
          <router-link
            :to="{ path: `/track/${stream.trackId}` }"
            v-for="(stream, index) in streams"
            :key="index"
            class="group"
          >
            <div class="relative pb-8">
              <!-- v-if="streams && index !== streams.length - 1" -->
              <span
                v-if="
                  streams &&
                  index !== streams.length - 1 &&
                  index != 0 &&
                  new Date(streams[index + 1]?.endTime)?.getDay() ==
                    new Date(stream.endTime).getDay()
                "
                class="absolute top-[2rem] left-[2rem] -ml-px h-full w-0.5 bg-neutral-600"
                aria-hidden="true"
              />
              <div class="relative flex space-x-3">
                <div class="relative h-[4rem] w-[4rem]">
                  <div class="pt-2 h-[4rem] w-[4rem] bg-bodySecundary rounded-full text-center">
                    <div
                      class="absolute h-[4rem] w-[4rem] bg-bodyPrimary opacity-0 group-hover:opacity-10 z-20"
                    ></div>
                    <div class="z-10">
                      <span class="text-neutral-400 text-sm font-medium block"
                        >{{ dayjs(stream.endTime).format('MMM') }}
                      </span>
                      <span class="text-primary relative mt-[-.2rem] text-2xl font-bold block">{{
                        dayjs(stream.endTime).format('D')
                      }}</span>
                    </div>
                  </div>
                </div>
                <div
                  class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 group-hover:opacity-90"
                >
                  <div class="flex h-full flex-col">
                    <router-link
                      :to="{ path: `/track/${stream.trackId}` }"
                      class="text-xl font-bold text-white mt-auto"
                      >{{ stream.trackName }}</router-link
                    >
                    <span class="text-lg font-normal text-neutral-400 -mt-1 mb-auto"
                      >Streamed for
                      {{
                        dayjs
                          .duration({ milliseconds: stream.playedMs })
                          .add({ milliseconds: 0 }) // zonder dit werkt t niet lol
                          .format('mm:ss')
                      }}</span
                    >
                  </div>
                  <div
                    class="text-right text-sm whitespace-nowrap font-medium text-neutral-400 flex h-full flex-col"
                  >
                    <time class="my-auto">{{ dayjs(stream.endTime).fromNow() }}</time>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import dayjs from '~/dayjs';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
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

onMounted(async () => {
  const id = parseInt(route.params.id.toString());

  artist.value = await api.artists.get(id);
  tracks.value = await api.artists.tracks(id);
  streams.value = await api.users.getArtistStreams('me', id, { query: { limit: 100 } });
});
</script>
