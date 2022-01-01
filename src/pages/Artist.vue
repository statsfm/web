<template>
  <HeroProfile
    v-if="artist"
    :name="artist.name"
    :followers="artist.followers"
    :image="artist.image"
  />
  <Container>
    <div v-if="artist">
      <ChipGroup class="mt-5">
        <Link
          v-for="(genre, index) in artist.genres"
          :key="index"
          :to="{ name: 'Genre', params: { tag: genre } }"
        >
          <Chip>{{ genre }}</Chip>
        </Link>
      </ChipGroup>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '~/api';

import Container from '~/components/layout/Container.vue';
import Link from '~/components/base/Link.vue';
import HeroProfile from '~/components/base/HeroProfile.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import Chip from '~/components/base/Chip/Chip.vue';

import { useI18n } from 'vue-i18n';
import { BacktrackArtist } from '~/types/backtrack';

const { t } = useI18n();
const route = useRoute();

const artist: Ref<BacktrackArtist | null> = ref(null);

const getArtist = async (id: number): Promise<BacktrackArtist> => {
  const res = await api.get(`/artists/${id}`);
  return res.data.item;
};

const getArtistStreamCount = async (id: number): Promise<number> => {
  const res = await api.get(`/streams/artist/${route.params.id}/count`);
  return res.data.data;
};

const getArtistStreamDuration = async (id: number): Promise<number> => {
  const res = await api.get(`/streams/artist/${id}/duration`);
  return res.data.data;
};

onMounted(async () => {
  const id = parseInt(route.params.id.toString());

  artist.value = await getArtist(id);
});
</script>
