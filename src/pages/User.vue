<template>
  <Header class="bg-bodySecundary" />
  <LoadingOverlay v-if="isLoading" />
  <div class="bg-bodySecundary" v-if="user">
    <Container class="flex gap-5 pt-24 pb-10 flex-col items-center md:flex-row">
      <Avatar :src="user.image" :size="48" />
      <div class="flex flex-col justify-end">
        <h1 class="text-4xl font-black text-center md:text-6xl">
          {{ user.displayName }}
        </h1>
      </div>
    </Container>
  </div>
  <Container>
    <div class="flex gap-2 overflow-x-auto">
      <router-link
        v-for="(artist, index) in stats?.artists"
        :key="index"
        :to="{
          name: 'Artist',
          params: {
            id: artist.artist.id,
            slug: artist.artist.name.toLowerCase().split(' ').join('-')
          }
        }"
      >
        <div
          :style="{ backgroundImage: `url(${artist.artist.image})` }"
          class="h-32 aspect-square bg-cover bg-center rounded-2xl"
        ></div
      ></router-link>
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';

import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import Avatar from '~/components/base/Avatar.vue';
import LoadingOverlay from '~/components/base/LoadingOverlay.vue';
import api from '~/api';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

const isLoading = ref(false);
const user: Ref<BacktrackFriend | null> = ref(null);
const stats: Ref<BacktrackFriendStats | null> = ref(null);

const getUser = async (): Promise<BacktrackFriend> => {
  const res = await api.get(`/friends/get/${route.params.id}`);
  return res.data.data;
};

const getUserStats = async (): Promise<BacktrackFriendStats> => {
  const res = await api.get(`/friends/stats/${route.params.id}`);
  return res.data.data;
};

onMounted(async () => {
  isLoading.value = true;
  user.value = await getUser();
  stats.value = await getUserStats();
  isLoading.value = false;
});
</script>
