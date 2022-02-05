<template>
  <HeroWithImageAndInfo
    v-if="artist"
    :name="artist.name"
    :subtitle="`${formatFollowers(artist.followers)} ${t('artist.followers')}`"
    :image="artist.image"
  />
  <Container>
    <div v-if="artist" class="mt-5">
      <section>
        <StickyHeader>
          <h2>Genres</h2>
        </StickyHeader>

        <ChipGroup>
          <Link
            v-for="(genre, index) in artist.genres"
            :key="index"
            :to="{ name: 'Genre', params: { tag: genre } }"
          >
            <Chip>{{ genre }}</Chip>
          </Link>
        </ChipGroup>
      </section>

      <section>
        <StickyHeader>
          <h2>Tracks by {{ artist.name }}</h2>

          <RealDropdown>
            <template v-slot:button="{ active }">
              <Button
                variant="secundary"
                size="small"
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                type="button"
              >
                {{ trackCount }}
                tracks

                <Icon :path="active ? mdiChevronUp : mdiChevronDown" />
              </Button>
            </template>

            <div
              id="dropdown"
              class="w-44 text-base list-none rounded divide-y divide-neutral-100 shadow"
            >
              <List class="rounded-xl">
                <ListItemGroup :items="trackCounts" @click="(e) => (trackCount = e)">
                  <template v-slot="{ item }">
                    <ListItem
                      :class="{ 'text-primary': trackCount == item }"
                      @click="trackCount = item"
                      >{{ item }} tracks</ListItem
                    >
                  </template>
                </ListItemGroup>
              </List>
            </div>
          </RealDropdown>
        </StickyHeader>

        <div class="mt-3 grid grid-cols-3 gap-y-3 gap-x-4 md:grid-cols-4 md:gap-x-6 lg:grid-cols-6">
          <RouterLink
            :to="{ name: 'Track', params: { id: track.id } }"
            class="group relative"
            v-for="(track, index) in tracks?.slice(0, trackCount)"
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
          </RouterLink>
        </div>
      </section>

      <section>
        <StickyHeader>
          <h2>Your streams featuring {{ artist.name }}</h2>
        </StickyHeader>

        <RecentStreams v-if="streams" :streams="streams" />
      </section>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, RouterLink } from 'vue-router';
import Chip from '~/components/base/Chip/Chip.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import Link from '~/components/base/Link.vue';
import Container from '~/components/layout/Container.vue';
import Image from '~/components/base/Image.vue';
import RecentStreams from '~/components/base/RecentStreams/RecentStreams.vue';
import StickyHeader from '~/components/base/StickyHeader.vue';
import Button from '~/components/base/Button.vue';
import Icon from '~/components/base/Icon.vue';
import RealDropdown from '~/components/base/dropdowns/RealDropdown.vue';
import List from '~/components/base/List/List.vue';
import ListItem from '~/components/base/List/ListItem.vue';
import ListItemGroup from '~/components/base/List/ListItemGroup.vue';

import { mdiChevronUp, mdiChevronDown } from '@mdi/js';

import { useApi } from '~/hooks';
import { BacktrackArtist, BacktrackStream, BacktrackTrack } from '~/types/backtrack';

const { t } = useI18n();
const route = useRoute();
const api = useApi();

const artist: Ref<BacktrackArtist | null> = ref(null);
const tracks: Ref<BacktrackTrack[] | null> = ref(null);
const streams: Ref<BacktrackStream[] | null> = ref(null);

const trackCounts = [6, 10, 25, 50, 100, 150, 200, 250, 300];
const trackCount = ref(trackCounts[0]);

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
