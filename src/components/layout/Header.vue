<template>
  <header>
    <Container class="flex justify-between items-center py-3">
      <router-link to="/" class="flex gap-3">
        <Logo class="w-[2rem] h-[2rem]" />
        <h1 class="text-2xl font-bold sm:hidden md:block">Spotistats</h1>
      </router-link>
      <div class="flex items-center gap-5">
        <Button v-if="!auth.isLoggedIn()" size="small" @click="auth.login()"
          >Login</Button
        >
        <Dropdown v-if="auth.isLoggedIn()">
          <template v-slot:button>
            <Avatar :src="user?.image" class="cursor-pointer" />
          </template>

          <div class="flex items-center gap-5">
            <Avatar :src="user?.image" />
            <div class="flex content-start justify-center flex-col">
              <div class="flex items-center gap-2">
                <Text size="l" weight="semi-bold" truncate>{{
                  user?.displayName
                }}</Text>
                <Badge v-if="user?.isPlus">Plus</Badge>
              </div>
              <p class="font-bold text-textGrey">{{ user?.email }}</p>
            </div>
          </div>

          <Divider />
          <Button size="small" @click="auth.logout" class="w-full"
            >Logout</Button
          >
        </Dropdown>
      </div>
    </Container>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Container from "./Container.vue";
import Logo from "../base/Logo.vue";
import Avatar from "../base/Avatar.vue";
import Heading from "../base/Heading.vue";
import Button from "../base/Button.vue";
import Dropdown from "../base/dropdowns/Dropdown.vue";
import Divider from "../base/Divider.vue";
import Text from "../base/Text.vue";
import Badge from "../base/Badge.vue";
import Modal from "../base/modals/Modal.vue";
import { useAuth } from "~/hooks";
import { useStore } from "~/store";

export default defineComponent({
  components: {
    Container,
    Logo,
    Avatar,
    Heading,
    Button,
    Dropdown,
    Divider,
    Text,
    Badge,
    Modal,
  },
  setup() {
    const store = useStore();
    const user = store.state.user;
    const auth = useAuth();

    return { user, auth };
  },
});
</script>
