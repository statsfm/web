<template>
  <div v-if="track">
    <Hero>
      <Avatar :src="track.albums[0]?.image" size="large" shape="squared" />
      <div class="flex flex-col justify-end">
        <span class="text-center text-xl font-medium md:text-left">
          <router-link :to="{ path: `/artist/${track.artists[0].id}` }">
            {{ track.artists.map((artist: statsfm.ArtistSimple) => artist.name).join(', ') }}
          </router-link>
        </span>
        <h1 class="text-center md:text-left">{{ track.name }}</h1>
        <div
          class="mt-2 grid w-full auto-cols-max grid-flow-col content-around items-stretch gap-3 text-center"
        >
          <a
            :href="`https://open.spotify.com/track/${track.externalIds.spotify![0]}`"
            target="blank"
          >
            <SpotifyIcon />
          </a>
          <a :href="`https://song.link/s/${track.externalIds.spotify![0]}`" target="blank">
            <img
              src="https://cdn.stats.fm/file/statsfm/images/brands/songlink/color.webp"
              class="h-7 w-7"
            />
          </a>
        </div>
      </div>
    </Hero>
  </div>
  <Container>
    <div class="my-8"></div>

    <section class="mt-5">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3>Your streams</h3>
          <ImportRequired>
            <span class="text-xl" v-if="stats && stats?.count != undefined">
              {{ stats?.count }}
            </span>
            <span class="text-xl" v-else> Loading... </span>
          </ImportRequired>
        </div>
        <div>
          <h3>Your minutes streamed</h3>
          <ImportRequired>
            <span class="text-xl" v-if="stats && stats?.durationMs != undefined">
              {{ Math.round(stats.durationMs / 1000 / 60 / 60)?.toLocaleString() }}
            </span>
            <span class="text-xl" v-else> Loading... </span>
          </ImportRequired>
        </div>
      </div>
    </section>

    <section>
      <StickyHeader>
        <h2 v-if="track && track.artists.length > 1">Artists</h2>
        <h2 v-else>Artist</h2>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <!-- TODO: fade between images -->
        <li v-if="track && !artists" v-for="(artist, index) in track.artists" :key="index">
          <RouterLink :to="{ name: 'Artist', params: { id: artist.id } }" class="group relative">
            <div class="aspect-square group-hover:opacity-90">
              <Image variant="round" :alt="artist.name" class="h-full w-full" />
            </div>

            <div class="mt-2 text-center">
              <div>
                <h4 class="line-clamp-2">
                  {{ artist.name }}
                </h4>
              </div>
            </div>
          </RouterLink>
        </li>
        <li v-if="artists" v-for="(artist, index) in artists" :key="index">
          <RouterLink :to="{ name: 'Artist', params: { id: artist.id } }" class="group relative">
            <div class="aspect-square group-hover:opacity-90">
              <Image
                :src="artist?.image"
                variant="round"
                :alt="artist.name"
                class="h-full w-full"
              />
            </div>

            <div class="mt-2 text-center">
              <div>
                <h4 class="line-clamp-2">
                  {{ artist.name }}
                </h4>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>Appears on</h2>

        <RealDropdown>
          <template v-slot:button="{ active }">
            <Button
              variant="secundary"
              size="small"
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              type="button"
            >
              {{ maxAlbumCount }}
              albums

              <Icon :path="active ? mdiChevronUp : mdiChevronDown" />
            </Button>
          </template>

          <List class="w-44 rounded-xl">
            <ListItemGroup :items="maxAlbumCounts" @click="(e) => (maxAlbumCount = e)">
              <template v-slot="{ item }">
                <ListItem
                  :class="{ 'text-primary': maxAlbumCount == item }"
                  @click="maxAlbumCount = item"
                  >{{ item }} albums</ListItem
                >
              </template>
            </ListItemGroup>
          </List>
        </RealDropdown>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li
          v-for="(album, index) in track?.albums?.slice(0, maxAlbumCount)"
          :key="index"
          class="group"
        >
          <router-link :to="{ name: 'Album', params: { id: album.id } }">
            <div class="min-h-80 aspect-square w-full group-hover:opacity-90">
              <Image :src="album.image" :alt="album.name" class="h-full w-full" />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h4 class="line-clamp-2">
                  {{ album.name }}
                </h4>
                <!-- <ArtistNameListRender :artists="album.album.artists" /> -->
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>Audio features</h2>
      </StickyHeader>

      <AudioFeaturesRadarChart
        v-if="track"
        @features="(e: any) => (genres = e)"
        :topTracks="[track]"
      />
    </section>

    <section>
      <StickyHeader>
        <h2>Top listeners</h2>

        <RealDropdown>
          <template v-slot:button="{ active }">
            <Button
              variant="secundary"
              size="small"
              id="dropdownButton"
              data-dropdown-toggle="dropdown"
              type="button"
            >
              {{ maxTopListenerCount }}
              users

              <Icon :path="active ? mdiChevronUp : mdiChevronDown" />
            </Button>
          </template>

          <List class="w-44 rounded-xl">
            <ListItemGroup :items="maxTopListenerCounts" @click="(e) => (maxTopListenerCount = e)">
              <template v-slot="{ item }">
                <ListItem
                  :class="{ 'text-primary': maxTopListenerCount == item }"
                  @click="maxTopListenerCount = item"
                  >{{ item }} users</ListItem
                >
              </template>
            </ListItemGroup>
          </List>
        </RealDropdown>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-8 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li
          v-if="topListeners"
          v-for="(user, index) in topListeners?.slice(0, maxTopListenerCount)"
          :key="index"
        >
          <RouterLink
            :to="{ name: 'User', params: { userId: user.user.customId ?? user.user.id } }"
            class="group relative"
          >
            <div class="relative aspect-square group-hover:opacity-90">
              <Image
                :src="user.user.image"
                variant="round"
                :alt="user.user.displayName"
                class="h-full w-full"
              />
              <div class="absolute bottom-1 left-2 rounded-lg bg-black py-[0.15rem]">
                <span
                  :class="[
                    user.position == 1 ? '!bg-amber-400 !bg-opacity-30 !text-amber-400' : '',
                    user.position == 2 ? '!bg-gray-500 !bg-opacity-30 !text-gray-500' : '',
                    user.position == 3 ? ' !bg-yellow-700 !bg-opacity-30 !text-yellow-700' : '',
                    'rounded-lg bg-bodySecundary py-[0.35rem] px-2 text-lg drop-shadow-lg'
                  ]"
                  >#{{ user.position }}</span
                >
              </div>
            </div>

            <div class="mt-2 text-center">
              <div>
                <h4 class="line-clamp-2">
                  {{ user.user.displayName }}
                </h4>
                <span class="text-neutral-400 line-clamp-2">
                  {{ user.streams?.toLocaleString() }} streams •
                  {{ Math.round((user.playedMs ?? 0) / 1000 / 60)?.toLocaleString() + ' minutes' }}
                </span>
              </div>
            </div>
          </RouterLink>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>Your streams</h2>
      </StickyHeader>

      <ImportRequired>
        <div v-if="streams">
          <RecentStreams :pairs="pairs" />

          <div class="text-center" v-if="streams && streams.length > 0">
            <Button
              variant="secundary"
              size="small"
              id="loadMoreButton"
              type="button"
              @click="loadStreams()"
            >
              Load more streams
              <Icon :path="mdiChevronDown" />
            </Button>
          </div>
        </div>
        <span v-else>Loading...</span>
      </ImportRequired>
    </section>
  </Container>
</template>

<script lang="ts" setup>
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import * as statsfm from '@statsfm/statsfm.js';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import AudioAnalysis from '~/components/base/AudioAnalysis/AudioAnalysis.vue';
import AudioFeaturesRadarChart from '~/components/base/AudioFeatures/AudioFeaturesRadarChart.vue';
import Avatar from '~/components/base/Avatar.vue';
import Button from '~/components/base/Button.vue';
import RealDropdown from '~/components/base/dropdowns/RealDropdown.vue';
import Hero from '~/components/base/Hero.vue';
import Icon from '~/components/base/Icon.vue';
import Image from '~/components/base/Image.vue';
import List from '~/components/base/List/List.vue';
import ListItem from '~/components/base/List/ListItem.vue';
import ListItemGroup from '~/components/base/List/ListItemGroup.vue';
import SpotifyIcon from '~/components/base/SpotifyIcon.vue';
import ImportRequired from '~/components/base/ImportRequired.vue';
import RecentStreams from '~/components/base/RecentStreams/RecentStreams.vue';
import StatsCard from '~/components/base/StatsCard.vue';
import StickyHeader from '~/components/base/StickyHeader.vue';
import Container from '~/components/layout/Container.vue';
import dayjs from '~/dayjs';
import { useApi, useAuth, useUser } from '~/hooks';

const route = useRoute();
const { t } = useI18n();
const api = useApi();
const auth = useAuth();
const user = useUser();

const genres: Ref<any | null> = ref(null);

const track: Ref<statsfm.Track | null> = ref(null);
const audioAnalysis: Ref<statsfm.AudioAnalysis | null> = ref(null);
const artists: Ref<statsfm.Artist[] | null> = ref(null);
const stats: Ref<statsfm.StreamStats | null> = ref(null);
const streams: Ref<statsfm.Stream[] | undefined> = ref(undefined);
const pairs: Ref<Record<string, statsfm.Stream[]>> = ref({});
const topListeners: Ref<statsfm.TopUser[] | null> = ref(null);

const maxAlbumCounts = ref([6, 10, 25, 50, 100, 150, 200, 250, 300]);
const maxAlbumCount = ref(maxAlbumCounts.value[0]);

const maxTopListenerCounts = ref([6, 12, 18, 24, 30, 60, 120, 180, 250]);
const maxTopListenerCount = ref(maxTopListenerCounts.value[0]);

const segment: Ref<{
  current: statsfm.AudioAnalysisSegment;
  next: statsfm.AudioAnalysisSegment;
} | null> = ref(null);

const onSegmentHover = (e: any) => {
  segment.value = e;
};

const loadTrack = async () => {
  const id = parseInt(route.params.id.toString());
  track.value = await api.tracks.get(id);

  maxAlbumCounts.value = maxAlbumCounts.value.filter((x, i, a) => {
    x = a[i - 1] ?? x;
    return track.value!.albums.length >= x;
  });
};

const loadStreams = async () => {
  streams.value = (streams.value ?? []).concat(
    await api.users.trackStreams('me', track.value!.id, {
      limit: 100,
      offset: streams.value?.length ?? 0
    })
  );

  pairs.value = {};
  if (streams?.value != undefined) {
    streams.value?.forEach((stream) => {
      const dm = dayjs(stream.endTime).format('LL');

      pairs.value[dm] = [...(pairs.value[dm] ?? []), stream];
    });
  }
};

const loadArtists = async () => {
  artists.value = await api.artists.list(track.value!.artists.map(({ id }) => id));
};

const loadStats = async () => {
  stats.value = await api.users.trackStats(user!.id, track.value!.id);
};

const loadAnalysis = async () => {
  audioAnalysis.value = await (
    await api.http.get(`/spotify/audio-features/${track.value!.externalIds.spotify![0]}`)
  ).data.item;
  console.log(audioAnalysis.value);
};

const loadTopListeners = async () => {
  topListeners.value = (await (
    await api.http.get(`/tracks/${track.value?.id}/top/listeners`)
  ).data.items) as statsfm.TopUser[];

  maxTopListenerCounts.value = maxTopListenerCounts.value.filter((x, i, a) => {
    x = a[i - 1] ?? x;
    return topListeners.value!.length >= x;
  });
};

onMounted(async () => {
  await loadTrack();
  if (user?.isPlus == true && user?.hasImported == true) loadStats();
  loadArtists();
  loadAnalysis();
  loadTopListeners();
  if (user?.isPlus == true && user?.hasImported == true) loadStreams();

  const albums = await api.albums.list(track.value!.albums.map(({ id }) => id));
  console.log(
    'albums',
    albums.filter(({ type }) => type == 'album')
  );
  console.log(
    'complication',
    albums.filter(({ type }) => type == 'complication')
  );
  console.log(
    'single',
    albums.filter(({ type }) => type == 'single')
  );
});
</script>
