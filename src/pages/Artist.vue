<template>
  <HeroWithImageAndInfo
    v-if="artist"
    :name="artist.name"
    :subtitle="formatFollowers(artist.followers)"
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
import BacktrackApi from '~/api';

import Container from '~/components/layout/Container.vue';
import Link from '~/components/base/Link.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import ChipGroup from '~/components/base/Chip/ChipGroup.vue';
import Chip from '~/components/base/Chip/Chip.vue';

import { useI18n } from 'vue-i18n';
import { BacktrackArtist } from '~/types/backtrack';
import {
  GetArtistResponse,
  GetStreamArtistCountResponse,
  GetStreamArtistDurationResponse
} from '~/types';

const { t } = useI18n();
const route = useRoute();

const artist: Ref<BacktrackArtist | null> = ref(null);

const getArtist = async (id: number): Promise<BacktrackArtist> => {
  const res = await BacktrackApi.get<GetArtistResponse>(`/artists/${id}`);
  return res.data.item;
};

const getArtistStreamCount = async (id: number): Promise<number> => {
  const res = await BacktrackApi.get<GetStreamArtistCountResponse>(
    `/streams/artist/${route.params.id}/count`
  );
  return res.data.data;
};

const getArtistStreamDuration = async (id: number): Promise<number> => {
  const res = await BacktrackApi.get<GetStreamArtistDurationResponse>(
    `/streams/artist/${id}/duration`
  );
  return res.data.data;
};

// TODO: move this to the helpers folder
const formatFollowers = (followers: number): string => {
  return followers.toLocaleString('en-US');
};

onMounted(async () => {
  const id = parseInt(route.params.id.toString());

  artist.value = await getArtist(id);
});
</script>
