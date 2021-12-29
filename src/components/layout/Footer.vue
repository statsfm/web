<template>
  <Container class="pt-14 pb-14">
    <div class="xl:grid xl:gap-8 font-bold">
      <div class="grid grid-cols-2 gap-8 xl:col-span-2">
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 class="text-md font-bold text-textGrey tracking-wider">Backtrack</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <router-link class="text-base text-gray-300 hover:text-white" :to="{ name: 'Home' }"
                  >Home</router-link
                >
              </li>
              <li>
                <a
                  class="text-base text-gray-300 hover:text-white"
                  href="https://support.spotistats.app/"
                  target="blank"
                  >Support</a
                >
              </li>
              <li>
                <a
                  class="text-base text-gray-300 hover:text-white"
                  href="https://discord.gg/NeaBE96Vs6"
                  target="_blank"
                  >Discord</a
                >
              </li>
            </ul>
          </div>
          <div class="mt-12 md:mt-0">
            <h3 class="text-md font-bold text-textGrey tracking-wider">Socials</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <a
                  class="text-base text-gray-300 hover:text-white"
                  href="https://discord.gg/backtrack"
                  target="blank"
                  >Discord</a
                >
              </li>
              <li>
                <a
                  class="text-base text-gray-300 hover:text-white"
                  href="https://twitter.com/spotistats"
                  target="blank"
                  >Twitter</a
                >
              </li>
              <li>
                <a
                  class="text-base text-gray-300 hover:text-white"
                  href="https://www.instagram.com/spotistats"
                  target="blank"
                  >Instagram</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div class="mt-12 md:mt-0">
            <h3 class="text-md font-bold text-textGrey tracking-wider">Legal</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <router-link
                  class="text-base text-gray-300 hover:text-white"
                  :to="{ name: 'Privacy' }"
                  >Privacy</router-link
                >
              </li>
              <li>
                <router-link
                  class="text-base text-gray-300 hover:text-white"
                  :to="{ name: 'Terms' }"
                  >Terms</router-link
                >
              </li>
            </ul>
          </div>
          <div class="mt-10 md:mt-0">
            <h3 class="text-md font-semibold text-textGrey tracking-wider">Download</h3>
            <div class="mt-4"></div>
            <a
              class="h-12"
              href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
              target="blank"
              ><img src="../../assets/apple_appstore_badge.png" alt="Apple Appstore" class="h-12" />
            </a>
            <div class="mt-2"></div>
            <a
              class="h-12"
              href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
              target="blank"
              ><img src="../../assets/google_play_badge.png" alt="Google Play" class="h-12" />
            </a>
            <div class="mt-2">
              <Button class="hidden md:block">Open webapp</Button>
            </div>
            <!-- <h3 class="text-md font-bold text-textGrey tracking-wider">Explore</h3>
            <ul class="mt-4 space-y-4">
              <li>
                <a
                  href="https://twitter.com/hiettdigital"
                  target="_blank"
                  class="text-base text-gray-300 hover:text-white"
                  >@hiettdigital</a
                >
              </li>
              <li>
                <a
                  href="https://twitter.com/roberttwestbury"
                  target="_blank"
                  class="text-base text-gray-300 hover:text-white"
                  >@roberttwestbury</a
                >
              </li>
            </ul> -->
          </div>
        </div>
      </div>
    </div>
    <p class="mt-10 pt-10 text-center text-textGrey font-bold md:mt-0 md:order-1">
      © 2021 Backtrack / Spotistats. All rights reserved. Made with ❤️ in the Netherlands
    </p>
  </Container>
</template>

<script lang="ts" setup>
import Container from '../layout/Container.vue';
import Button from '../base/Button.vue';
</script>
