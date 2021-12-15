<template>
  <Container class="pt-14 pb-14 flex flex-col flex-wrap">
    <div class="font-bold grid grid-cols-3 md:grid-cols-5 mb-6">
      <div class="flex flex-col gap-2">
        <p class="text-textGrey">Spotistats</p>
        <a>Home</a>
        <a>Support</a>
        <a>About</a>
      </div>

      <div class="hidden md:flex flex-col gap-2">
        <p class="text-textGrey">Socials</p>
        <a>Twitter</a>
        <a>Discord</a>
        <a>Instagram</a>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-textGrey">Explore</p>
        <a>Artists</a>
        <a>Tracks</a>
        <a>Albums</a>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-textGrey">Legal</p>
        <a>Privacy</a>
        <a>Terms</a>
      </div>

      <div class="flex flex-col gap-2 mt-5 md:mt-0">
        <p class="text-textGrey">Download</p>
        <div class="flex gap-2 justify-center w-full">
          <img
            src="../../assets/apple_appstore_badge.png"
            alt="Apple Appstore"
            class="w-6/12"
          />
          <img
            src="../../assets/google_play_badge.png"
            alt="Google Play"
            class="w-6/12"
          />
        </div>
        <Button class="hidden md:block">Open webapp</Button>
      </div>
    </div>
    <span class="text-textGrey font-bold"
      >@ 2021 Spotistats. All rights reserverd. Made with ❤️ in the
      Netherlands</span
    >
  </Container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Container from "../layout/Container.vue";
import Button from "./Button.vue";

export default defineComponent({
  components: {
    Container,
    Button,
  },
});
</script>
