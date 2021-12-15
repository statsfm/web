<template>
  <Container class="grid place-items-center h-[70vh]">
    <Loading />
  </Container>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { defineComponent, onBeforeMount } from "vue";

import Container from "~/components/layout/Container.vue";
import Loading from "~/components/base/Loading.vue";
import { useAuth } from "~/hooks/auth";
import router from "~/router";

export default defineComponent({
  components: {
    Container,
    Loading,
  },
  setup() {
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
        router.push("/");
      } else {
        auth.login();
      }
    });
  },
});
</script>
