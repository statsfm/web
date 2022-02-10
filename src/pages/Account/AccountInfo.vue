<template>
  <div>
    <h1>Account info</h1>
    <br />
    <div class="grid grid-cols-3 gap-6">
      <div class="col-span-3 sm:col-span-2">
        <label for="customUrl" class="text-lg font-bold text-neutral-400">Custom url</label>
        <div class="mt-1 flex">
          <span
            class="inline-flex items-center pl-3 rounded-l-lg bg-bodySecundary text-neutral-400 text-lg font-medium"
          >
            https://stats.fm/
          </span>
          <input
            type="text"
            name="customUrl"
            v-model="user.id"
            class="py-2 flex-1 block w-full rounded-r-lg bg-bodySecundary text-white text-lg font-bold placeholder:text-neutral-600"
            :placeholder="user.id"
          />
        </div>
      </div>
    </div>
    <br />
    <div>
      <label for="about" class="text-lg font-bold text-neutral-400">About</label>
      <div class="mt-1">
        <textarea
          id="about"
          name="about"
          maxlength="512"
          rows="3"
          class="mt-1 block w-full px-3 py-1 rounded-lg bg-bodySecundary text-white text-lg font-medium placeholder:text-neutral-600"
          placeholder="Something about yourself..."
        ></textarea>
      </div>
      <p class="mt-2 text-sm font-bold text-neutral-400">
        Brief description for your profile (max 512 characters)
      </p>
    </div>
    <br />
    <Button size="small" class="" @click="alert('not implemented yet')">Save</Button>
    <!-- <pre class="text-white">{{ JSON.stringify(user) }}</pre> -->
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

const user = useUser();

onMounted(async () => {
  const _user = await api.me.get();
  store.setUser(_user);
});
</script>
