<template>
  <Header />
  <Container class="grid place-items-center h-[70vh]">
    <Loading />
  </Container>
</template>

<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import Loading from '~/components/base/Loading.vue';
import { useAuth } from '~/hooks/auth';
import router from '~/router';

const auth = useAuth();

onBeforeMount(() => {
  const params = new URLSearchParams(location.search);
  if (params.has('code')) {
    const token = params.get('code');

    if (token && token.startsWith('ey')) {
      return auth.setToken(token);
    }
  }

  if (auth.isLoggedIn()) {
    router.back();
  } else {
    auth.login();
  }
});
</script>
