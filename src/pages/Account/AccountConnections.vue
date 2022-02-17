<template>
  <div>
    <h1>Connections</h1>
    <div class="mt-5 rounded-2xl bg-bodySecundary shadow">
      <div class="px-5 py-4">
        <div class="flex flex-row items-center gap-3">
          <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" class="h-7" />
          <h3 class="text-2xl font-bold text-white">Discord</h3>
        </div>
        <div class="sm:flex sm:items-start sm:justify-between">
          <div class="text-2sm max-w-xl text-neutral-400">
            <p>
              Connect your Discord account to get access to personalized commands with the
              Spotistats Discord bot
            </p>
          </div>
          <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <Button size="small">Connect</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 rounded-2xl bg-bodySecundary shadow">
      <div class="px-5 py-4">
        <div class="flex flex-row items-center gap-3">
          <img src="https://www.svgrepo.com/show/354270/reddit-icon.svg" class="h-7" />
          <h3 class="text-2xl font-bold text-white">Reddit</h3>
        </div>
        <div class="sm:flex sm:items-start sm:justify-between">
          <div class="text-2sm max-w-xl text-neutral-400">
            <p>Connect your Reddit account to get access to a flare in the r/statsfm subreddit</p>
          </div>
          <div class="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
            <Button size="small">Connect</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import Container from '~/components/layout/Container.vue';
import Divider from '~/components/base/Divider.vue';
import DeleteData from './DeleteData.vue';
import Header from '~/components/layout/Header.vue';
import { useApi, useAuth, useUser } from '~/hooks';
import { useStore } from '~/store';

const router = useRouter();
const auth = useAuth();
const api = useApi();
const store = useStore();

onMounted(async () => {});
</script>
