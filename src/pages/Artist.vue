<template>
  <Header class="bg-bodySecundary" />
  <LoadingOverlay v-if="isLoading" />
  <div class="bg-bodySecundary" v-if="artist">
    <Container class="flex gap-5 pt-24 pb-10 flex-col items-center md:flex-row">
      <Avatar :src="artist.image" :size="48" />
      <div class="flex flex-col justify-end">
        <span class="font-medium text-textGrey text-center md:text-left">
          {{
            t("artist.followers", {
              count: formatFollowers(artist.followers),
            })
          }}</span
        >
        <h1 class="text-4xl font-black text-center md:text-6xl">
          {{ artist.name }}
        </h1>
      </div>
    </Container>
  </div>
  <Container>
    <div v-if="artist">
      <ChipGroup class="mt-5">
        <Chip v-for="(genre, index) in artist.genres" :key="index">{{
          genre
        }}</Chip>
      </ChipGroup>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import api from "~/api";

import Header from "~/components/layout/Header.vue";
import Container from "~/components/layout/Container.vue";
import LoadingOverlay from "~/components/base/LoadingOverlay.vue";
import Avatar from "~/components/base/Avatar.vue";
import { useI18n } from "vue-i18n";
import ChipGroup from "~/components/base/Chip/ChipGroup.vue";
import Chip from "~/components/base/Chip/Chip.vue";

const { t } = useI18n();
const route = useRoute();

const isLoading = ref(false);
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

const formatFollowers = (followers: number): string => {
  return followers.toLocaleString("en-US");
};

onMounted(async () => {
  const id = parseInt(route.params.id.toString());

  isLoading.value = true;
  artist.value = await getArtist(id);
  isLoading.value = false;
});
</script>
