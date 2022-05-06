<template>
  <!-- <HeroWithImageAndInfo v-if="user" :name="user.displayName" :image="user.image" /> -->
  <Hero v-if="user">
    <Avatar :src="user.image" size="large" />
    <div class="flex flex-col justify-end">
      <span class="text-center text-lg font-medium text-neutral-500 md:text-left">
        {{ user.profile.pronouns }}
      </span>
      <h1 class="text-center md:text-left">{{ user.displayName }}</h1>
      <span class="mt-1 text-center text-lg font-medium md:text-left">
        {{ user.profile.bio }}
      </span>
      <div
        class="mt-5 grid w-full auto-cols-max grid-flow-col content-around items-stretch gap-3 text-center"
      >
        <a :href="`https://open.spotify.com/user/${user.id}`" target="blank">
          <SpotifyIcon />
        </a>
        <a
          v-if="user.socialMediaConnections.find((x) => x.platform.name == 'Discord') != undefined"
          :href="`https://discord.com/users/${
            user.socialMediaConnections.find((x) => x.platform.name == 'Discord')!.platformUserId
          }`"
          target="blank"
        >
          <img
            src="https://cdn.stats.fm/file/statsfm/images/brands/discord/color.svg"
            class="mt-[2px] h-6 w-6"
          />
        </a>
      </div>
    </div>
  </Hero>
  <Container>
    <div class="my-8"></div>
    <div class="flex items-center justify-between gap-5">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div v-for="item in stats" :key="item.name">
          <h3>{{ item.name }}</h3>
          <span class="text-xl">{{ item.stat }}</span>
        </div>
      </div>

      <RealDropdown>
        <template v-slot:button>
          <Button size="small" class="capitalize">{{ range }}</Button>
        </template>

        <List class="w-44 rounded-xl">
          <!-- TODO: fix with i18n and range -->
          <ListItemGroup
            :items="[statsfm.Range.WEEKS, statsfm.Range.MONTHS, statsfm.Range.LIFETIME]"
            @click="(e) => setRange(e)"
          >
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

          <List class="w-44 rounded-xl">
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
        </RealDropdown>
      </StickyHeader>

      <ul class="mt-3 grid grid-cols-3 gap-y-3 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(track, index) in topTracks?.slice(0, topTracksCount)" :key="index">
          <RouterLink :to="{ name: 'Track', params: { id: track.track.id } }" class="group">
            <div class="min-h-80 aspect-square w-full group-hover:opacity-90">
              <Image
                :src="track.track.albums[0].image"
                :alt="track.track.albums[0].name"
                class="h-full w-full"
              />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h4 class="line-clamp-2">
                  <span>{{ track.position }}.</span>
                  {{ track.track.name }}
                </h4>
                <ArtistNameListRender :artists="track.track.artists" />
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

          <List class="w-44 rounded-xl">
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
                <h4 class="line-clamp-2">
                  <span>{{ artist.position }}.</span>
                  {{ artist.artist.name }}
                </h4>
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

          <List class="w-44 rounded-xl">
            <ListItemGroup :items="albumCounts" @click="(e) => (albumCount = e)">
              <template v-slot="{ item }">
                <ListItem :class="{ 'text-primary': albumCount == item }" @click="albumCount = item"
                  >{{ item }} albums</ListItem
                >
              </template>
            </ListItemGroup>
          </List>
        </RealDropdown>
      </StickyHeader>

      <ul class="grid grid-cols-3 gap-y-4 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
        <li v-for="(album, index) in topAlbums?.slice(0, albumCount)" :key="index" class="group">
          <router-link :to="{ name: 'Album', params: { id: album.album.id } }">
            <div class="min-h-80 aspect-square w-full group-hover:opacity-90">
              <Image :src="album.album.image" :alt="album.album.name" class="h-full w-full" />
            </div>
            <div class="mt-3 flex justify-between">
              <div>
                <h4 class="line-clamp-2">
                  <span>{{ album.position }}.</span>
                  {{ album.album.name }}
                </h4>
                <ArtistNameListRender :artists="album.album.artists" />
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

      <AudioFeaturesRadarChart
        v-if="recentStreams"
        @features="(e) => (genres = e)"
        :topTracks="recentStreams.map((stream) => stream.track)"
      />
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
                    class="absolute h-20 w-20 bg-bodyPrimary opacity-0 group-hover:opacity-10"
                  ></div>
                  <img
                    class="flex h-20 w-20 items-center justify-center rounded-lg"
                    :src="stream.track.albums[0].image"
                    :alt="stream.track.albums[0].name"
                  />
                </div>
                <div
                  class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5 group-hover:opacity-90"
                >
                  <div class="flex h-full flex-col">
                    <RouterLink
                      :to="{ name: 'Track', params: { id: stream.track.id } }"
                      class="mt-auto text-xl font-bold text-white line-clamp-2"
                      >{{ stream.track.name }}</RouterLink
                    >
                    <ArtistNameListRender :artists="stream.track.artists" />
                  </div>
                  <div
                    class="flex h-full flex-col whitespace-nowrap text-right text-sm font-medium text-neutral-400"
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
import { useRoute, RouterLink, useRouter } from 'vue-router';
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
import Hero from '~/components/base/Hero.vue';
import SpotifyIcon from '~/components/base/SpotifyIcon.vue';
import dayjs from '~/dayjs';
import { useApi } from '~/hooks';
import * as statsfm from '@statsfm/statsfm.js';
import { AudioFeature } from '~/components/base/AudioFeatures/feature';
import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import Avatar from '~/components/base/Avatar.vue';
import StickyHeader from '~/components/base/StickyHeader.vue';
import ArtistNameListRender from '~/components/base/ArtistNameListRender.vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const api = useApi();

const id = route.params.userId.toString();

const range: Ref<statsfm.Range> = ref(statsfm.Range.LIFETIME);
const genres: Ref<any | null> = ref(null);
const user: Ref<
  | (statsfm.UserPublic & {
      profile: statsfm.UserProfile;
      privacySettings: statsfm.UserPrivacySettings;
      socialMediaConnections: statsfm.UserSocialMediaConnection[];
    })
  | null
> = ref(null);
const recentStreams: Ref<statsfm.RecentlyPlayedTrack[] | null> = ref(null);
const topTracks: Ref<statsfm.TopTrack[] | null> = ref(null);
const topArtists: Ref<statsfm.TopArtist[] | null> = ref(null);
const topAlbums: Ref<statsfm.TopAlbum[] | null> = ref(null);

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
  user.value = await api.users.get(id).catch(() => {});
  if (!user.value) {
    return router.replace({ name: 'NotFound' });
  }
  api.users
    .topTracks(id, {
      range: range.value
    })
    .then((data: any) => (topTracks.value = data));
  api.users
    .topArtists(id, {
      range: range.value
    })
    .then((data: any) => (topArtists.value = data));
  api.users
    .topAlbums(id, {
      range: range.value
    })
    .then((data: any) => (topAlbums.value = data));
  api.users.recentlyStreamed(id).then((data: any) => (recentStreams.value = data));

  api.users.stats(id, { range: range.value }).then(({ durationMs, count }) => {
    stats.value.push(
      {
        name: t('user.streams'),
        stat: count?.toLocaleString()
      },
      {
        name: t('user.time_streamed'),
        stat: Math.round(durationMs / 1000 / 60 / 60)?.toLocaleString() + ' hours'
      }
    );
  });
};

const setRange = (value: any) => {
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
