<template>
  <Header />
  <Container class="pt-5">
    <div class="flex flex-col gap-10 lg:flex-row justify-between relative">
      <div class="md:flex flex-col md:flex-row">
        <!-- TODO: responsiveness for this menu -->
        <!-- TODO: make a component for this menu -->
        <div class="flex flex-col md:w-48 text-gray-700 flex-shrink-0 -ml-4">
          <h3 class="block px-4 font-bold text-white">Account</h3>
          <nav class="flex-grow md:block pb-4 md:pb-0 md:overflow-y-auto">
            <router-link
              v-for="item in items"
              :key="item.label"
              :class="[
                'block px-4 py-2 mt-2 font-bold rounded-lg hover:opacity-90 hover:bg-bodySecundary  focus:bg-bodySecundary',
                route.name == item.to.name
                  ? 'text-primary bg-bodySecundary'
                  : 'text-white bg-transparent'
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
import { onMounted, ref } from 'vue';
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

onMounted(async () => {});
</script>
