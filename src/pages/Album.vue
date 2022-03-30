<template>
  <div v-if="album">
    <Hero>
      <Avatar :src="album.image" size="large" shape="squared" />
      <div class="flex flex-col justify-end">
        <span class="text-center text-xl font-medium md:text-left">
          <router-link :to="{ path: `/artist/${album.artists[0].id}` }">
            {{ album.artists.map((artist: statsfm.ArtistSimple) => artist.name).join(', ') }}
          </router-link>
        </span>
        <h1 class="text-center md:text-left">{{ album.name }}</h1>
        <div
          class="mt-2 grid w-full auto-cols-max grid-flow-col content-around items-stretch gap-3 text-center"
        >
          <a
            :href="`https://open.spotify.com/album/${album.externalIds.spotify![0]}`"
            target="blank"
          >
            <SpotifyIcon />
          </a>
          <a :href="`https://song.link/s/${album.externalIds.spotify![0]}`" target="blank">
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
        <h2>Album content</h2>
      </StickyHeader>

      <div class="grid grid-rows-none md:grid-flow-col md:grid-rows-5">
        <RouterLink
          :to="{ name: 'Track', params: { id: track.id } }"
          class="group relative"
          v-for="(track, index) in tracks"
          :key="index"
        >
          <div class="flex items-start">
            <span class="mt-3 w-8 pr-2 text-right align-middle text-xl text-neutral-500"
              >{{ index + 1 }}.
            </span>
            <div class="mt-3 ml-2 flex justify-between">
              <div>
                <h3 class="text-xl text-white line-clamp-2">
                  {{ track.name }}
                </h3>
                <p class="mt-0 text-lg text-neutral-400 line-clamp-1">
                  {{ track.artists.map((a: statsfm.ArtistSimple) => a.name).join(', ') }}
                </p>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>

    <section>
      <StickyHeader>
        <h2 v-if="album && album.artists.length > 1">Artists</h2>
        <h2 v-else>Artist</h2>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <!-- TODO: fade between images -->
        <li v-if="album && !artists" v-for="(artist, index) in album.artists" :key="index">
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
        <h2>Your streams</h2>
      </StickyHeader>

      <ImportRequired>
        <div v-if="streams">
          <RecentStreams :pairs="pairs" />

          <div class="text-center" v-if="streams && streams!.length > 0">
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
import { mdiChevronDown } from '@mdi/js';
import * as statsfm from '@statsfm/statsfm.js';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import Avatar from '~/components/base/Avatar.vue';
import Button from '~/components/base/Button.vue';
import Hero from '~/components/base/Hero.vue';
import Icon from '~/components/base/Icon.vue';
import Image from '~/components/base/Image.vue';
import ImportRequired from '~/components/base/ImportRequired.vue';
import RecentStreams from '~/components/base/RecentStreams/RecentStreams.vue';
import SpotifyIcon from '~/components/base/SpotifyIcon.vue';
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

const album: Ref<statsfm.Album | null> = ref(null);
const audioAnalysis: Ref<statsfm.AudioAnalysis | null> = ref(null);
const artists: Ref<statsfm.Artist[] | null> = ref(null);
const stats: Ref<statsfm.StreamStats | null> = ref(null);
const streams: Ref<statsfm.Stream[] | undefined> = ref(undefined);
const pairs: Ref<Record<string, statsfm.Stream[]>> = ref({});

const tracks: Ref<statsfm.Track[] | null> = ref(null);
const loadAlbum = async () => {
  const id = parseInt(route.params.id.toString());
  album.value = await api.albums.get(id);
};

const loadStreams = async () => {
  streams.value = (streams.value ?? []).concat(
    await api.users.albumStreams('me', album.value!.id, {
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

const loadTracks = async () => {
  tracks.value = await api.albums.tracks(album.value!.id);
};

const loadArtists = async () => {
  artists.value = await api.artists.list(album.value!.artists.map(({ id }) => id));
};

const loadStats = async () => {
  stats.value = await api.users.albumStats(user!.id, album.value!.id);
  console.log(stats.value);
};

onMounted(async () => {
  await loadAlbum();
  if (user?.isPlus == true && user?.hasImported == true) loadStats();
  loadTracks();
  loadArtists();
  if (user?.isPlus == true && user?.hasImported == true) loadStreams();
});
</script>
