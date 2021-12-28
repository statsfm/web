<template>
  <router-view />
  <Footer />
  <Toaster />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Footer from '~/components/layout/Footer.vue';
import Toaster from '~/components/base/Toaster/Toaster.vue';

export default defineComponent({
  components: {
    Footer,
    Toaster
  }
});
</script>
