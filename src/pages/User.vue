<template>
  <Container>
    <div v-if="user" class="flex flex-col">
      <div class="flex flex-col items-center">
        <Avatar class="w-32" :src="user.image" />
        <h1 class="text-4xl font-bold">{{ user.displayName }}</h1>
      </div>
      <div v-if="stats" class="flex">
        <div
          class="w-32 aspect-square bg-center bg-cover bg-no-repeat rounded-2xl"
          :style="{ backgroundImage: `url(${artist.artist.image})` }"
          v-for="(artist, index) in stats.artists.sort(
            (a, b) => a.position > b.position
          )"
          :key="index"
        ></div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

import Container from "~/components/layout/Container.vue";
import Avatar from "~/components/base/Avatar.vue";
import api from "~/api";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    Container,
    Avatar,
  },
  setup() {
    const route = useRoute();

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
      user.value = await getUser();
      stats.value = await getUserStats();
    });

    return { user, stats };
  },
});
</script>
