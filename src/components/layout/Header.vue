<template>
  <header>
    <Container class="flex justify-between items-center py-3">
      <router-link to="/" class="flex gap-3">
        <Logo class="w-[1.7rem] h-[1.7rem]" />
        <h1 class="text-2xl font-bold hidden md:block">
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
              @click="router.push({ name: 'User', params: { userId: 'me' } })"
            >
              <div class="flex items-center">
                <Avatar :src="user.image" />
              </div>
              <div>
                <h5>{{ user.displayName }}</h5>
                <p class="m-0">{{ user.email }}</p>
              </div>
            </ListItem>

            <!-- TODO: improvements -->
            <ListItemGroup :items="[1]">
              <ListItem @click="auth.logout">Log out</ListItem>
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
import Divider from '../base/Divider.vue';
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
