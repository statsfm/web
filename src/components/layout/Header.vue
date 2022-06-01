<template>
  <header>
    <div
      class="fixed bottom-0 left-0 z-50 w-screen border-t-[1px] border-neutral-700 bg-bodyPrimary py-1 text-center"
    >
      <span class="text-sm font-semibold text-primary">This site is still a work in progress</span>
      <span class="pl-1 text-sm font-semibold text-neutral-100">
        Please note a lot of features are still missing ;)
      </span>
    </div>
    <Container class="flex items-center justify-between py-3">
      <router-link to="/" class="flex gap-3">
        <Logo class="h-[1.7rem] w-[1.7rem]" />
        <h1 class="hidden text-2xl font-bold md:block">
          {{ isSpotistats ? 'Spotistats' : 'Stats.fm' }}
        </h1>
      </router-link>
      <form class="relative ml-auto pt-2 md:mr-10" @submit.prevent="search">
        <input
          class="h-10 rounded-xl border-2 border-transparent bg-bodySecundary px-4 pr-20 text-white focus:border-neutral-700 focus:outline-none"
          type="search"
          name="search"
          placeholder="Search"
          v-model="searchInput"
        />
        <button type="submit" class="absolute right-0 top-0 mt-5 mr-4">
          <svg
            class="h-4 w-4 fill-current text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            id="Capa_1"
            x="0px"
            y="0px"
            viewBox="0 0 56.966 56.966"
            style="enable-background: new 0 0 56.966 56.966"
            xml:space="preserve"
            width="512px"
            height="512px"
          >
            <path
              d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
            />
          </svg>
        </button>
      </form>
      <div v-if="!isSpotistats" class="flex items-center gap-5">
        <RealDropdown v-if="auth.isLoggedIn() && user">
          <template v-slot:button>
            <Avatar :src="user.image" :name="user.displayName" size="md" class="cursor-pointer" />
          </template>

          <List class="rounded-xl">
            <ListItem
              class="flex gap-2"
              @click="router.push({ name: 'User', params: { userId: user!.customId ?? user!.id } })"
            >
              <div class="flex items-center">
                <Avatar :src="user.image" :name="user.displayName" size="md" />
              </div>
              <div>
                <h5>{{ user.displayName }}</h5>
                <p class="m-0">{{ user.email }}</p>
              </div>
            </ListItem>

            <!-- TODO: improvements and use i18n strings instead -->
            <ListItemGroup
              :items="[
                {
                  label: 'My page',
                  handler: () =>
                    router.push({
                      name: 'User',
                      params: { userId: user!.customId ?? user!.id }
                    })
                },
                {
                  label: 'My account',
                  handler: () => router.push({ name: 'AccountInfo' })
                },
                {
                  label: 'Log out',
                  handler: auth.logout
                }
              ]"
            >
              <template v-slot="{ item }">
                <ListItem @click="item.handler">{{ item.label }}</ListItem>
              </template>
            </ListItemGroup>
          </List>
        </RealDropdown>
        <Button v-else size="small" @click="auth.login()">Login</Button>
      </div>
    </Container>
  </header>
</template>

<script lang="ts" setup>
import Container from './Container.vue';
import Logo from '../base/Logo.vue';
import { Avatar } from '../base/Avatar';
import Button from '../base/Button.vue';
import RealDropdown from '../base/dropdowns/RealDropdown.vue';
import { useAuth, useUser } from '~/hooks';
import { useRouter } from 'vue-router';
import List from '../base/List/List.vue';
import ListItem from '../base/List/ListItem.vue';
import ListItemGroup from '../base/List/ListItemGroup.vue';
import { ref } from 'vue';

const router = useRouter();
const user = useUser();
const auth = useAuth();
const isSpotistats = window.location.host == 'spotistats.app';

const props = defineProps<{
  searchInput?: string;
}>();

const searchInput = ref(props.searchInput ?? '');

const search = async () => {
  router.push({ name: 'Search', query: { q: searchInput.value } });
};
</script>
