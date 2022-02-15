<template>
  <h3>Delete your account and all associated data</h3>
  <p>
    Before you can delete your data you must login with your Spotify account to confirm it's you.
    After logging in you have 60 seconds to delete your account; after that you have to login again
    to proceed.
  </p>
  <div v-if="validLogin">
    <div class="form-check">
      <input
        class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-primary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        type="checkbox"
        id="deleteAccountCheck"
        v-model="agreed"
      />
      <label class="form-check-label inline-block text-neutral-400" for="deleteAccountCheck">
        I acknowledge that this action is irreversable and this will delete all my data such as:<br />
        - Any purchases I've made (for example for Spotistats Plus)<br />
        - Any automatically syncing playlists I've made<br />
        - Any streams I've imported / synced<br />
        - Any friend (requests)
      </label>
    </div>
    <Button class="mt-2" @click="deleteAccount" size="small" :disabled="!agreed || loading">{{
      loading ? 'Deleting your data...' : 'Delete my account and all my data'
    }}</Button>
  </div>
  <Button v-else @click="login" size="small">Login to continue</Button>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import { useApi, useAuth } from '~/hooks';

const router = useRouter();
const agreed = ref(false);
const auth = useAuth();
const validLogin = auth.hasValidToken(60);
const loading = ref(false);
const api = useApi();

const deleteAccount = async () => {
  loading.value = true;
  const confirmed = confirm(
    'Are you sure you want to delete your account? This action is irreversible!'
  );
  if (!confirmed) return;

  await api.me.deleteAccount();

  router.push({ name: 'Home' });
};
const login = () => {
  auth.login();
};

onMounted(async () => {});
</script>
