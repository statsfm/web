<template>
  <Header />
  <Container class="pt-5">
    <div class="relative flex flex-col justify-between gap-10 lg:flex-row">
      <div class="flex-col md:flex md:flex-row">
        <!-- TODO: responsiveness for this menu -->
        <!-- TODO: make a component for this menu -->
        <div class="-ml-4 flex flex-shrink-0 flex-col text-gray-700 md:w-48">
          <h3 class="block px-4 font-bold text-white">Account</h3>
          <nav class="flex-grow pb-4 md:block md:overflow-y-auto md:pb-0">
            <router-link
              v-for="item in items"
              :key="item.label"
              :class="[
                'mt-2 block rounded-lg px-4 py-2 font-bold hover:bg-bodySecundary hover:opacity-90  focus:bg-bodySecundary',
                route.name == item.to.name
                  ? 'bg-bodySecundary text-primary'
                  : 'bg-transparent text-white'
              ]"
              :to="item.to"
              >{{ item.label }}</router-link
            >
          </nav>
        </div>
      </div>
      <router-view class="w-full" />
    </div>
  </Container>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '~/components/base/Button.vue';
import Container from '~/components/layout/Container.vue';
import Header from '~/components/layout/Header.vue';
import { useApi, useAuth } from '~/hooks';

const items = [
  {
    to: { name: 'AccountInfo' },
    label: 'Info'
  },
  {
    to: { name: 'AccountConnections' },
    label: 'Connections'
  },
  {
    to: { name: 'AccountPrivacy' },
    label: 'Privacy & data'
  }
];

const router = useRouter();
const route = useRoute();
const agreed = ref(false);
const auth = useAuth();
const validLogin = auth.hasValidToken(60);
const loading = ref(false);
const api = useApi();

onBeforeMount(async () => {
  if (!auth.isLoggedIn()) {
    auth.login();
  }
});
</script>
