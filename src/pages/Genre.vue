<template>
  <Hero>
    <h1 class="text-center font-black capitalize">
      {{ route.params.tag.toString() }}
    </h1>
  </Hero>
  <Container v-if="genre">
    <section>
      <StickyHeader>
        <h2>Related genres</h2>
      </StickyHeader>

      <ChipGroup class="mt-5">
        <Link
          v-for="(related, index) in genre.related"
          :key="index"
          :to="{ name: 'Genre', params: { tag: related } }"
        >
          <Chip>{{ related }}</Chip>
        </Link>
      </ChipGroup>
    </section>

    <section>
      <StickyHeader>
        <h2>Artists</h2>
      </StickyHeader>

      <div class="grid grid-cols-2 gap-8 md:grid-cols-4 xl:grid-cols-5">
        <div v-for="(artist, index) in genre.artists" :key="index" class="overflow-hidden">
          <Link :to="{ name: 'Artist', params: { id: artist.id, slug: '' } }">
            <Avatar size="large" :src="artist.image" />
            <h4 class="my-2 truncate text-center">{{ artist.name }}</h4>
            <ChipGroup>
              <Link
                v-for="(genre, index) in artist.genres"
                :key="index"
                :to="{ name: 'Genre', params: { tag: genre } }"
              >
                <Chip>{{ genre }}</Chip>
              </Link>
            </ChipGroup>
          </Link>
        </div>
      </div>
    </section>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Avatar from '~/components/base/Avatar.vue';
import Chip from '~/components/base/Chip/Chip.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import Hero from '~/components/base/Hero.vue';
import Link from '~/components/base/Link.vue';
import Container from '~/components/layout/Container.vue';
import StickyHeader from '~/components/base/StickyHeader.vue';

import { useApi } from '~/hooks';
import * as statsfm from '@statsfm/statsfm.js';

const route = useRoute();
const api = useApi();

const genre: Ref<any | null> = ref(null);

const getGenre = async (tag: string): Promise<any> => {
  return await api.genres.get(tag);
};

watch(
  () => route.params.tag,
  async (tag) => {
    genre.value = await getGenre(tag.toString());
  }
);

onMounted(async () => {
  const tag = route.params.tag.toString();
  genre.value = await getGenre(tag);
});
</script>
