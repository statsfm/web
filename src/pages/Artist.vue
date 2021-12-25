<template>
  <Header class="bg-bodySecundary" />
  <LoadingOverlay v-if="isLoading" />
  <div class="bg-bodySecundary" v-if="artist">
    <Container class="flex gap-5 pt-24 pb-10 flex-col items-center md:flex-row">
      <Avatar :src="artist.image" :size="48" />
      <div class="flex flex-col justify-end">
        <span class="font-bold text-textGrey text-center md:text-left">
          {{
            t("artist.followers", {
              count: formatFollowers(artist.followers),
            })
          }}</span
        >
        <h1 class="text-4xl font-bold text-center">{{ artist.name }}</h1>
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

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import api from "~/api";

import Header from "~/components/layout/Header.vue";
import Container from "~/components/layout/Container.vue";
import LoadingOverlay from "~/components/base/LoadingOverlay.vue";
import Avatar from "~/components/base/Avatar.vue";
import { useI18n } from "vue-i18n";
import ChipGroup from "~/components/base/Chip/ChipGroup.vue";
import Chip from "~/components/base/Chip/Chip.vue";
import Button from "~/components/base/Button.vue";

export default defineComponent({
  components: {
    Header,
    Container,
    LoadingOverlay,
    Avatar,
    ChipGroup,
    Chip,
    Button,
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();

    const isLoading = ref(false);
    const artist: Ref<BacktrackArtist | null> = ref(null);
    const stats: Ref<BacktrackTopArtist | null> = ref(null);

    const getArtist = async (): Promise<BacktrackArtist> => {
      isLoading.value = true;
      const res = await api.get(`/artists/${route.params.id}`);

      if (res.success) {
        isLoading.value = false;
      }

      return res.data.item;
    };

    const formatFollowers = (followers: number): string => {
      return followers.toLocaleString("en-US");
    };

    onMounted(async () => {
      artist.value = await getArtist();
    });

    return { t, isLoading, artist, formatFollowers };
  },
});
</script>
