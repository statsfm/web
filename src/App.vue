<template>
  <router-view />
  <Footer />
  <Toaster />
  <!-- Zodat de user overal geladen is -->
  <!-- <Auth /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Footer from '~/components/layout/Footer.vue';
import Toaster from '~/components/base/Toaster/Toaster.vue';
// import Auth from '~/components/base/Auth.vue';

export default defineComponent({
  components: {
    Footer,
    Toaster
    // Auth
  }
});
</script>
