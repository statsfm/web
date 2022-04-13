<template>
  <Header :search-input="query" class="bg-bodyPrimary" />
  <Container>
    <div class="my-8"></div>

    <section>
      <StickyHeader>
        <h2>Artists</h2>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(artist, index) in artists" :key="index" class="group">
          <router-link :to="{ name: 'Artist', params: { id: artist.id } }">
            <div class="min-h-80 aspect-square w-full group-hover:opacity-90">
              <Image :src="artist.image" :alt="artist.name" class="h-full w-full" variant="round" />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h4 class="line-clamp-2">
                  {{ artist.name }}
                </h4>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>Albums</h2>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(album, index) in albums" :key="index" class="group">
          <router-link :to="{ name: 'Album', params: { id: album.id } }">
            <div class="min-h-80 aspect-square w-full group-hover:opacity-90">
              <Image :src="album.image" :alt="album.name" class="h-full w-full" variant="square" />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h4 class="line-clamp-2">
                  {{ album.name }}
                </h4>
                <ArtistNameListRender :artists="album.artists" />
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </section>

    <section>
      <StickyHeader>
        <h2>Tracks</h2>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(track, index) in tracks" :key="index" class="group">
          <router-link :to="{ name: 'Track', params: { id: track.id } }">
            <div class="min-h-80 aspect-square w-full group-hover:opacity-90">
              <Image
                :src="track.albums[0]?.image"
                :alt="track.name"
                class="h-full w-full"
                variant="square"
              />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h4 class="line-clamp-2">
                  {{ track.name }}
                </h4>
                <ArtistNameListRender :artists="track.artists" />
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </section>
  </Container>
</template>

<script lang="ts" setup>
import { mdiChevronDown } from '@mdi/js';
import Header from '~/components/layout/Header.vue';
import * as statsfm from '@statsfm/statsfm.js';
import { onBeforeMount, onMounted, onUpdated, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteUpdate, RouterLink, useRoute } from 'vue-router';
import Avatar from '~/components/base/Avatar.vue';
import Button from '~/components/base/Button.vue';
import Hero from '~/components/base/Hero.vue';
import Icon from '~/components/base/Icon.vue';
import Image from '~/components/base/Image.vue';
import ImportRequired from '~/components/base/ImportRequired.vue';
import RecentStreams from '~/components/base/RecentStreams/RecentStreams.vue';
import SpotifyIcon from '~/components/base/SpotifyIcon.vue';
import StickyHeader from '~/components/base/StickyHeader.vue';
import ArtistNameListRender from '~/components/base/ArtistNameListRender.vue';
import Container from '~/components/layout/Container.vue';
import dayjs from '~/dayjs';
import { useApi, useAuth, useUser } from '~/hooks';

const route = useRoute();
const { t } = useI18n();
const api = useApi();
const auth = useAuth();

let query = route.query.q as string;

const albums: Ref<statsfm.Album[] | undefined> = ref(undefined);
const artists: Ref<statsfm.Artist[] | undefined> = ref(undefined);
const tracks: Ref<statsfm.Track[] | undefined> = ref(undefined);

const loadResults = async () => {
  tracks.value = undefined;
  artists.value = undefined;
  albums.value = undefined;
  const results = await api.search.search(query, [
    statsfm.SearchTypes.TRACK,
    statsfm.SearchTypes.ARTIST,
    statsfm.SearchTypes.ALBUM
  ]);
  tracks.value = results.tracks;
  artists.value = results.artists;
  albums.value = results.albums;
};

onBeforeRouteUpdate(async () => {
  query = route.query.q as string;
  await loadResults();
});

onBeforeMount(async () => {
  query = route.query.q as string;
  await loadResults();
});
</script>
