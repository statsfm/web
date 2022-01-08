<template>
  <Hero>
    <h1 class="font-black text-center capitalize">
      {{ route.params.tag.toString() }}
    </h1>
  </Hero>
  <Container v-if="genre">
    <h2 class="mt-10">Related genres</h2>
    <ChipGroup class="mt-5">
      <Link
        v-for="(genre, index) in genre.related"
        :key="index"
        :to="{ name: 'Genre', params: { tag: genre } }"
      >
        <Chip>{{ genre }}</Chip>
      </Link>
    </ChipGroup>

    <h2 class="mt-5 mb-2">Artists</h2>
    <div class="grid gap-8 grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
      <div v-for="(artist, index) in genre.artists" :key="index" class="overflow-hidden">
        <Link :to="{ name: 'Artist', params: { id: artist.id, slug: '' } }">
          <Avatar size="full" :src="artist.image" />
          <h4 class="my-2 text-center truncate">{{ artist.name }}</h4>
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
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import BacktrackApi from '~/api';
import { BacktrackGenre, GetGenreResponse } from '~/types';
import Container from '~/components/layout/Container.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import Link from '~/components/base/Link.vue';
import Chip from '~/components/base/Chip/Chip.vue';
import Hero from '~/components/base/Hero.vue';
import Avatar from '~/components/base/Avatar.vue';

const route = useRoute();

const genre: Ref<BacktrackGenre | null> = ref(null);

const getGenre = async (tag: string): Promise<BacktrackGenre> => {
  return await BacktrackApi.get<GetGenreResponse>(`/genres/${tag}`).then((res) => res.data.item);
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
