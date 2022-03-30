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
      <div v-if="!isSpotistats" class="flex items-center gap-5">
        <RealDropdown v-if="auth.isLoggedIn() && user">
          <template v-slot:button>
            <Avatar :src="user.image" class="cursor-pointer" />
          </template>

          <List class="rounded-xl">
            <ListItem
              class="flex gap-2"
              @click="router.push({ name: 'User', params: { userId: user.customId ?? user.id } })"
            >
              <div class="flex items-center">
                <Avatar :src="user.image" />
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
                      params: { userId: user.customId ?? user.id }
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
import Avatar from '../base/Avatar.vue';
import Button from '../base/Button.vue';
import RealDropdown from '../base/dropdowns/RealDropdown.vue';
import { useAuth, useUser } from '~/hooks';
import { useRouter } from 'vue-router';
import List from '../base/List/List.vue';
import ListItem from '../base/List/ListItem.vue';
import ListItemGroup from '../base/List/ListItemGroup.vue';

const router = useRouter();
const user = useUser();
const auth = useAuth();
const isSpotistats = window.location.host == 'spotistats.app';
</script>
