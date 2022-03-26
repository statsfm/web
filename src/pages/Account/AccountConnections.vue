<template>
  <div>
    <h1>Connections</h1>
    <div
      class="mt-5 rounded-2xl bg-bodySecundary shadow"
      v-for="platform in platforms"
      :key="platform.name"
    >
      <div class="px-5 py-4">
        <div class="flex flex-row items-center gap-3">
          <img :src="platform.icon" class="h-6" />
          <h3 class="text-2xl font-bold text-white">
            {{ platform.name }}
          </h3>
        </div>
        <span v-if="platform.connection" class="mt-5 text-sm text-neutral-300"
          >Connected as {{ platform.connection.platformUsername }}</span
        >
        <div class="sm:flex sm:items-start sm:justify-between">
          <div class="text-2sm max-w-xl text-neutral-400">
            <p>
              {{ platform.description }}
            </p>
          </div>
          <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <Button v-if="platform.status == -1" size="small" disabled>Loading...</Button>
            <Button v-if="platform.status == 0" size="small" @click="() => platform.connect()"
              >Connect</Button
            >
            <Button v-if="platform.status == 1" size="small" @click="() => platform.disconnect()"
              >Disconnect</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as statsfm from '@statsfm/statsfm.js';
import { onMounted, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import { useApi, useAuth } from '~/hooks';
import { useStore } from '~/store';

const router = useRouter();
const auth = useAuth();
const api = useApi();
const store = useStore();
const connections: Ref<statsfm.UserSocialMediaConnection[] | null> = ref(null);

const platforms: Ref<
  {
    name: string;
    description: string;
    icon: string;
    connect: Function;
    disconnect: Function;
    status: number;
    connection?: statsfm.UserSocialMediaConnection;
  }[]
> = ref([
  {
    name: 'Discord',
    description:
      'Connect your Discord account to get access to personalized commands with the Spotistats Discord bot',
    icon: 'https://cdn.stats.fm/file/statsfm/images/brands/discord/color.svg',
    connect: () => {
      location.href = `${api.http.config.baseUrl}/me/connections/discord/redirect?authorization=${api.http.config.accessToken}&redirect_uri=${location.href}`;
    },
    disconnect: () => {},
    status: -1,
    connection: undefined
  }
]);

const loadConnections = async () => {
  connections.value = await api.me.socialMediaConnections();

  platforms.value = platforms.value.map((platform) => {
    const connection = connections.value!.find(
      (connection) => connection.platform.name == platform.name
    );
    platform.status = 0;
    // @ts-ignore
    platform.connection = connection;

    if (connection) {
      platform.status = 1;
      platform.disconnect = async () => {
        await api.me.removeSocialMediaConnection(connection.id);
        loadConnections();
      };
    }

    return platform;
  });
};

onMounted(async () => {
  loadConnections();
});
</script>
