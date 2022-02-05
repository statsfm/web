<template>
  <HeroWithImageAndInfo
    v-if="user"
    :name="user.displayName"
    :subtitle="user.country"
    :image="user.image"
  />
  <Container class="relative">
    <div class="my-8"></div>
    <div class="flex items-center justify-between gap-5">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div v-for="item in stats" :key="item.name">
          <h3>{{ item.name }}</h3>
          <span class="text-xl">{{ item.stat }}</span>
        </div>
      </div>

      <RealDropdown>
        <template v-slot:button>
          <Button size="small" class="capitalize" @click="">{{ range }}</Button>
        </template>

        <List class="w-44 rounded-xl">
          <!-- TODO: fix with i18n and range -->
          <ListItemGroup :items="['weeks', 'months', 'lifetime']" @click="(e) => setRange(e)">
            <template v-slot="{ item }">
              <ListItem :class="{ 'text-primary': item == range }" @click="setRange(item)">{{
                item
              }}</ListItem>
            </template>
          </ListItemGroup>
        </List>
      </RealDropdown>
    </div>

    <div class="my-10"></div>

    <section>
      <StickyHeader>
        <h2>{{ t('user.top_tracks') }}</h2>

        <RealDropdown>
          <template v-slot:button="{ active }">
            <Button
              variant="secundary"
              size="small"
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              type="button"
            >
              {{ topTracksCount }}
              tracks

              <Icon :path="active ? mdiChevronUp : mdiChevronDown" />
            </Button>
          </template>

          <div
            id="dropdown"
            class="w-44 text-base list-none rounded divide-y divide-neutral-100 shadow"
          >
            <List class="rounded-xl">
              <ListItemGroup :items="topTracksCounts" @click="(e) => (topTracksCount = e)">
                <template v-slot="{ item }">
                  <ListItem
                    :class="{ 'text-primary': topTracksCount == item }"
                    @click="topTracksCount = item"
                    >{{ item }} tracks</ListItem
                  >
                </template>
              </ListItemGroup>
            </List>
          </div>
        </RealDropdown>
      </StickyHeader>

      <ul class="mt-3 grid grid-cols-3 gap-y-3 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(track, index) in topTracks?.slice(0, topTracksCount)" :key="index">
          <RouterLink :to="{ name: 'Track', params: { id: track.track.id } }" class="group">
            <div class="w-full min-h-80 aspect-square group-hover:opacity-90">
              <Image
                :src="track.track.albums[0].image"
                :alt="track.track.albums[0].name"
                class="h-full w-full"
              />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h3 class="text-lg text-white line-clamp-2">
                  <span class="text-neutral-400 font-normal">{{ track.position }}.</span>
                  {{ track.track.name }}
                </h3>
                <p class="mt-0 text-sm text-neutral-400 line-clamp-1">
                  {{ track.track.artists.map((a) => a.name).join(', ') }}
                </p>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>{{ t('user.top_artists') }}</h2>

        <RealDropdown>
          <template v-slot:button="{ active }">
            <Button
              variant="secundary"
              size="small"
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              type="button"
            >
              {{ artistCount }}
              artists

              <Icon :path="active ? mdiChevronUp : mdiChevronDown" />
            </Button>
          </template>

          <div
            id="dropdown"
            class="w-44 text-base list-none rounded divide-y divide-neutral-100 shadow"
          >
            <List class="rounded-xl">
              <ListItemGroup :items="artistCounts" @click="(e) => (artistCount = e)">
                <template v-slot="{ item }">
                  <ListItem
                    :class="{ 'text-primary': artistCount == item }"
                    @click="artistCount = item"
                    >{{ item }} artists</ListItem
                  >
                </template>
              </ListItemGroup>
            </List>
          </div>
        </RealDropdown>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(artist, index) in topArtists?.slice(0, artistCount)" :key="index">
          <RouterLink
            :to="{ name: 'Artist', params: { id: artist.artist.id } }"
            class="group relative"
          >
            <div class="aspect-square group-hover:opacity-90">
              <Image
                :src="artist.artist.image"
                variant="round"
                :alt="artist.artist.name"
                class="h-full w-full"
              />
            </div>

            <div class="mt-2 text-center">
              <div>
                <h3 class="text-lg text-white line-clamp-2">
                  <span class="text-neutral-400 font-normal">{{ artist.position }}.</span>
                  {{ artist.artist.name }}
                </h3>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>{{ t('user.top_albums') }}</h2>

        <RealDropdown>
          <template v-slot:button="{ active }">
            <Button
              variant="secundary"
              size="small"
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              type="button"
            >
              {{ albumCount }}
              albums

              <Icon :path="active ? mdiChevronUp : mdiChevronDown" />
            </Button>
          </template>

          <div
            id="dropdown"
            class="w-44 text-base list-none rounded divide-y divide-neutral-100 shadow"
          >
            <List class="rounded-xl">
              <ListItemGroup :items="albumCounts" @click="(e) => (albumCount = e)">
                <template v-slot="{ item }">
                  <ListItem
                    :class="{ 'text-primary': albumCount == item }"
                    @click="albumCount = item"
                    >{{ item }} albums</ListItem
                  >
                </template>
              </ListItemGroup>
            </List>
          </div>
        </RealDropdown>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(album, index) in topAlbums?.slice(0, albumCount)" :key="index" class="group">
          <router-link :to="{ name: 'Album', params: { id: album.album.id } }">
            <div class="w-full min-h-80 aspect-square group-hover:opacity-90">
              <Image :src="album.album.image" :alt="album.album.name" class="h-full w-full" />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h3 class="text-lg text-white line-clamp-2">
                  <span class="text-neutral-400 font-normal">{{ album.position }}.</span>
                  {{ album.album.name }}
                </h3>
                <p class="mt-0 text-sm text-neutral-400 line-clamp-1">
                  {{ album.album.artists.map((a) => a.name).join(', ') }}
                </p>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>{{ t('user.audio_analysis') }}</h2>
      </StickyHeader>

      <div class="flex justify-between pb-4">
        <div class="w-full md:w-1/2 flex flex-col justify-between">
          <div v-for="genre in genres?.sort((g1, g2) => g2.value - g1.value)">
            <label
              :aria-label="genre.label"
              for="progress"
              class="text-white text-xl font-medium capitalize"
              >{{ genre.label }}</label
            >
            <div name="progress" class="bg-bodySecundary h-3 w-full overflow-hidden rounded mt-1">
              <div
                :style="{ width: `${genre.value * 100}%` }"
                class="h-full bg-primary rounded"
              ></div>
            </div>
          </div>
        </div>
        <div class="w-1/2 justify-end hidden md:flex">
          <AudioFeaturesRadarChart
            v-if="recentStreams"
            @features="(e) => (genres = e)"
            :topTracks="recentStreams.map((stream) => stream.track)"
          />
        </div>
      </div>
    </section>

    <StickyHeader>
      <h2>{{ t('user.recent_streams') }}</h2>
    </StickyHeader>

    <div class="mt-4">
      <ul role="list" class="-mb-8">
        <li v-for="(stream, index) in recentStreams" :key="index">
          <RouterLink :to="{ name: 'Track', params: { id: stream.track.id } }" class="group">
            <div class="relative pb-8">
              <span
                v-if="recentStreams && index !== recentStreams.length - 1"
                class="absolute top-10 left-10 -ml-px h-full w-0.5 bg-neutral-600"
                aria-hidden="true"
              />
              <div class="relative flex space-x-3">
                <div class="relative">
                  <div
                    class="absolute w-20 h-20 bg-bodyPrimary opacity-0 group-hover:opacity-10"
                  ></div>
                  <img
                    class="h-20 w-20 rounded-lg flex items-center justify-center"
                    :src="stream.track.albums[0].image"
                    :alt="stream.track.albums[0].name"
                  />
                </div>
                <div
                  class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 group-hover:opacity-90"
                >
                  <div class="flex h-full flex-col">
                    <RouterLink
                      :to="{ name: 'Track', params: { id: stream.track.id } }"
                      class="text-xl font-bold text-white mt-auto line-clamp-2"
                      >{{ stream.track.name }}</RouterLink
                    >
                    <RouterLink
                      :to="{ name: 'Artist', params: { id: stream.track.artists[0].id } }"
                      class="text-lg text-neutral-400 -mt-1 mb-auto line-clamp-1"
                      >{{ stream.track.artists.map((a) => a.name).join(', ') }}</RouterLink
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
          </RouterLink>
        </li>
      </ul>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { useHead } from '@vueuse/head';
import { computed, onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, RouterLink } from 'vue-router';
import Button from '~/components/base/Button.vue';
import RealDropdown from '~/components/base/dropdowns/RealDropdown.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import Container from '~/components/layout/Container.vue';
import AudioFeaturesRadarChart from '~/components/base/AudioFeatures/AudioFeaturesRadarChart.vue';
import Image from '~/components/base/Image.vue';
import Icon from '~/components/base/Icon.vue';
import ListItemGroup from '~/components/base/List/ListItemGroup.vue';
import List from '~/components/base/List/List.vue';
import ListItem from '~/components/base/List/ListItem.vue';

import dayjs from '~/dayjs';
import { useApi } from '~/hooks';
import {
  BacktrackRange,
  BacktrackRecentlyPlayedTrack,
  BacktrackTopAlbum,
  BacktrackTopArtist,
  BacktrackTopTrack,
  BacktrackUser
} from '~/types';
import { AudioFeature } from '~/components/base/AudioFeatures/feature';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Avatar from '~/components/base/Avatar.vue';
import StickyHeader from '~/components/base/StickyHeader.vue';

const route = useRoute();
const { t } = useI18n();
const api = useApi();

const id = route.params.id.toString();

const range: Ref<BacktrackRange> = ref('lifetime');
const genres: Ref<AudioFeature[] | null> = ref(null);
const user: Ref<BacktrackUser | null> = ref(null);
const recentStreams: Ref<BacktrackRecentlyPlayedTrack[] | null> = ref(null);
const topTracks: Ref<BacktrackTopTrack[] | null> = ref(null);
const topArtists: Ref<BacktrackTopArtist[] | null> = ref(null);
const topAlbums: Ref<BacktrackTopAlbum[] | null> = ref(null);

const topTracksCounts = [6, 10, 25, 50, 100, 150, 200, 250, 300];
const topTracksCount = ref(topTracksCounts[0]);

const artistCounts = [6, 10, 25, 50, 100, 150, 200, 250, 300];
const artistCount = ref(artistCounts[0]);

const albumCounts = [6, 10, 25, 50, 100, 150, 200, 250, 300];
const albumCount = ref(albumCounts[0]);

const stats: Ref<any[]> = ref([]);

// TODO: remove hardcoded app name
const computedTitle = computed(() => `${user.value?.displayName} | Stats.fm`);

useHead({
  title: computedTitle,
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

const load = async () => {
  stats.value = [];
  user.value = await api.users.get(id);
  api.users
    .getTopTracks(id, {
      query: { range: range.value.toLowerCase() }
    })
    .then((data) => (topTracks.value = data));
  api.users
    .getTopArtists(id, {
      query: { range: range.value.toLowerCase() }
    })
    .then((data) => (topArtists.value = data));
  api.users
    .getTopAlbums(id, {
      query: { range: range.value.toLowerCase() }
    })
    .then((data) => (topAlbums.value = data));
  api.users
    .getRecentStreams(id, {
      query: { range: range.value.toLowerCase() }
    })
    .then((data) => (recentStreams.value = data));

  api.users.getCount(id, { query: { range: range.value.toLowerCase() } }).then((count) => {
    stats.value.push({
      name: t('user.streams'),
      stat: count
    });
  });
  api.users.getDuration(id, { query: { range: range.value.toLowerCase() } }).then((ms) => {
    stats.value.push({
      name: t('user.time_streamed'),
      stat: dayjs
        .duration({ milliseconds: ms })
        .add({ milliseconds: 0 })
        .format('HH [hours] mm [minutes] ss [seconds]')
    });
  });
};

const setRange = (value: BacktrackRange) => {
  // only fetch the range if the range has changed
  if (range.value !== value) {
    range.value = value;
    load();
  }
};

onMounted(() => {
  load();
});
</script>
