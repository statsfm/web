<template>
  <Header />
  <Container class="grid place-items-center h-[70vh]">
    <Loading />
  </Container>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";

import Header from "~/components/layout/Header.vue";
import Container from "~/components/layout/Container.vue";
import Loading from "~/components/base/Loading.vue";
import { useAuth } from "~/hooks/auth";
import router from "~/router";

const auth = useAuth();

onBeforeMount(() => {
  const params = new URLSearchParams(location.search);
  if (params.has("code")) {
    const code = params.get("code");

    if (code && code.length > 100) {
      return auth.exchangeSpotifyToken(code);
    }
  }

  if (auth.isLoggedIn()) {
    router.back();
  } else {
    auth.login();
  }
});
</script>
