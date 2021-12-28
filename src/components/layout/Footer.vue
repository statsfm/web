<template>
  <Container class="pt-14 pb-14 flex flex-col flex-wrap">
    <div class="font-bold grid grid-cols-3 md:grid-cols-5 mb-6">
      <div class="flex flex-col gap-2">
        <p class="text-textGrey">Spotistats</p>
        <router-link :to="{ name: 'Home' }">Home</router-link>
        <a href="https://support.spotistats.app/" target="blank">Support</a>
        <a>About</a>
      </div>

      <div class="hidden md:flex flex-col gap-2">
        <p class="text-textGrey">Socials</p>
        <a href="https://twitter.com/spotistats" target="blank">Twitter</a>
        <a href="https://discord.com/invite/aV9EtB3" target="blank">Discord</a>
        <a href="https://www.instagram.com/spotistats" target="blank">Instagram</a>
      </div>

      <!-- <div class="flex flex-col gap-2">
        <p class="text-textGrey">Explore</p>
        <a>Artists</a>
        <a>Tracks</a>
        <a>Albums</a>
      </div> -->

      <div class="flex flex-col gap-2">
        <p class="text-textGrey">Legal</p>
        <a>Privacy</a>
        <a>Terms</a>
      </div>

      <div class="flex flex-col gap-2 mt-5 md:mt-0">
        <p class="text-textGrey">Download</p>
        <div class="flex gap-2 justify-center w-full">
          <a
            class="hover:scale-[1.02] h-6/12"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
            ><img src="../../assets/apple_appstore_badge.png" alt="Apple Appstore" />
          </a>
          <a
            class="hover:scale-[1.02] h-6/12"
            href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
            target="blank"
            ><img src="../../assets/google_play_badge.png" alt="Google Play" />
          </a>
        </div>
        <Button class="hidden md:block">Open webapp</Button>
      </div>
    </div>
    <span class="text-textGrey font-bold"
      >@ 2021 Spotistats. All rights reserverd. Made with ❤️ in the Netherlands</span
    >
  </Container>
</template>

<script lang="ts" setup>
import Container from '../layout/Container.vue';
import Button from '../base/Button.vue';
</script>
