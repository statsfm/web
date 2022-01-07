<template>
  <header>
    <Container class="flex justify-between items-center py-3">
      <router-link to="/" class="flex gap-3">
        <Logo class="w-[1.7rem] h-[1.7rem]" />
        <h1 class="text-2xl font-bold hidden md:block">Backtrack.fm</h1>
      </router-link>
      <div class="flex items-center gap-5">
        <Button v-if="!auth.isLoggedIn()" size="small" @click="auth.login()">Login</Button>
        <Dropdown v-if="auth.isLoggedIn() && user">
          <template v-slot:button>
            <Avatar :src="user.image ?? ''" class="cursor-pointer" />
          </template>

          <div
            class="flex items-center gap-5 cursor-pointer"
            @click="router.push({ name: 'User', params: { id: user?.id } })"
          >
            <div class="flex content-start justify-center flex-col">
              <h1 class="font-bold text-2xl truncate">{{ user.displayName }}</h1>
              <p class="font-medium text-textGrey">{{ user.email }}</p>
            </div>
          </div>

          <Divider />
          <Button size="small" @click="auth.logout" class="w-full">Logout</Button>
        </Dropdown>
      </div>
    </Container>
  </header>
</template>

<script lang="ts" setup>
import Container from './Container.vue';
import Logo from '../base/Logo.vue';
import Avatar from '../base/Avatar.vue';
import Button from '../base/Button.vue';
import Dropdown from '../base/dropdowns/Dropdown.vue';
import Divider from '../base/Divider.vue';
import { useAuth, useUser } from '~/hooks';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = useUser();
const auth = useAuth();
</script>
