<template>
  <HeroWithImageAndInfo
    v-if="album"
    :name="album.name"
    :image="album.image"
    :subtitle="album.artists.map((artist) => artist.name).join(', ')"
    :subtitle-to="{ name: 'Artist', params: { id: album.artists[0].id } }"
  />
  <Container>
    <div v-if="album" class="mt-5">
      <h1 class="text-3xl">Album content</h1>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-2">
        <RouterLink
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
        </RouterLink>
      </div>

      <div class="my-10"></div>

      <h1 class="text-3xl mb-3">Your {{ album?.name }} streams</h1>

      <RecentStreams v-if="streams" :streams="streams" />
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, useRoute } from 'vue-router';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import Container from '~/components/layout/Container.vue';
import { useApi } from '~/hooks';
import { BacktrackAlbum, BacktrackStream, BacktrackTrack } from '~/types/backtrack';
import RecentStreams from '~/components/base/RecentStreams/RecentStreams.vue';

const { t } = useI18n();
const route = useRoute();
const api = useApi();

const id = parseInt(route.params.id.toString());

const album: Ref<BacktrackAlbum | null> = ref(null);
const tracks: Ref<BacktrackTrack[] | null> = ref(null);
const streams: Ref<BacktrackStream[] | null> = ref(null);

onMounted(async () => {
  album.value = await api.albums.get(id);
  tracks.value = await api.albums.tracks(id);
  streams.value = await api.users.getAlbumStreams('me', id);
});
</script>
