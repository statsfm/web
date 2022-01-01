<template>
  <Hero>
    <h1 class="text-4xl font-black text-center md:text-6xl capitalize">
      {{ route.params.tag.toString() }}
    </h1>
  </Hero>
  <Container v-if="genre">
    <ChipGroup class="mt-5">
      <Link
        v-for="(genre, index) in genre.related"
        :key="index"
        :to="{ name: 'Genre', params: { tag: genre } }"
      >
        <Chip>{{ genre }}</Chip>
      </Link>
    </ChipGroup>

    <div v-for="(artist, index) in genre.artists" :key="index">
      <img :src="artist.image" :alt="artist.name" class="rounded-full aspect-square w-20" />
      <h1>{{ artist.name }}</h1>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '~/api';
import { BacktrackGenre } from '~/types';
import Container from '~/components/layout/Container.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import Link from '~/components/base/Link.vue';
import Chip from '~/components/base/Chip/Chip.vue';
import Hero from '~/components/base/Hero.vue';

const route = useRoute();

const genre: Ref<BacktrackGenre | null> = ref(null);

const getGenre = async (tag: string): Promise<any> => {
  return await api.get(`/genres/${tag}`).then((res) => res.data.item);
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
