<template>
  <header>
    <Container class="header-content">
      <div class="logo">
        <NuxtLink to="/" class="invisible-link">
          <Logo />
          <Heading :size="1">Spotistats</Heading>
        </NuxtLink>
      </div>
      <div class="info">
        <Button
          v-if="!this.auth.isLoggedIn()"
          size="small"
          @click="this.auth.login"
          >Login</Button
        >

        <Dropdown>
          <template v-slot:button>
            <Avatar
              v-if="this.auth.isLoggedIn()"
              :src="user.image"
              class="avatar"
            />
          </template>

          <div class="name">
            <Text size="l" weight="semi-bold" truncate>{{
              user?.displayName
            }}</Text>
            <Badge v-if="user?.isPlus">Plus</Badge>
          </div>

          <Text size="s" type="secundary" truncate>{{ user?.email }}</Text>
          <Divider />
          <Button size="small" @click="this.auth.logout" class="logout"
            >Logout</Button
          >
        </Dropdown>
      </div>
    </Container>
  </header>

  <!-- <Modal>
    <Text size="m" class="mb-s">Are you sure you want to log out?</Text>

    <div class="flex gap-xs">
      <Button>Cancel</Button>
      <Button>Contiue</Button>
    </div>
  </Modal> -->
</template>

<style lang="scss" scoped>
header {
  background: var(--body-lighter);
  width: 100%;

  svg {
    display: block;
    width: 2rem;
    height: 2rem;
  }
}
.header-content {
  padding: var(--space-s) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo > a {
    display: flex;
    align-items: center;
    gap: var(--space-s);
  }

  .info {
    display: flex;
    align-items: center;
    gap: var(--space-s);

    .avatar {
      cursor: pointer;
    }

    .name {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .logout {
      width: 100%;
    }
  }
}
</style>

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
import { useStore } from "~/store";
import { useUser } from "~/hooks/user";
import { useAuth } from "~/hooks/auth";

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
    const user = useUser();
    const auth = useAuth();

    return { user, auth };
  },
});
</script>
