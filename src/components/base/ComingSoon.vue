<template>
  <div class="text-center pt-10 mt-5 mb-10">
    <h3 class="">Track, artist, album & genre pages are still in development</h3>
    <h4 class="text-neutral-400 font-medium">
      We're working as hard as we can on these pages and hope to release them soon : )
      <br />
      Meanwhile, you can
      <a
        class="text-lg text-primary font-bold"
        :href="`spotistats://stats.fm${$route.path}?utm_source=https://stats.fm&utm_medium=share_link_click`"
        target="_blank"
      >
        check out this page in the app
      </a>
    </h4>
  </div>
</template>

<script lang="ts" setup>
import Link from '~/components/base/Link.vue';
</script>
