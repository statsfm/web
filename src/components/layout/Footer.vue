<template>
  <Container class="pt-14 pb-14">
    <div class="xl:grid xl:gap-8 font-bold">
      <div class="grid grid-cols-2 gap-8 xl:col-span-2">
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h4 class="text-neutral-400">Backtrack</h4>
            <ul class="mt-4 space-y-4">
              <li>
                <Link :to="{ name: 'Home' }">Home</Link>
              </li>
              <li>
                <Link to="https://support.spotistats.app/">Support</Link>
              </li>
              <li>
                <Link to="https://discord.gg/NeaBE96Vs6">Discord</Link>
              </li>
            </ul>
          </div>
          <div class="mt-12 md:mt-0">
            <h4 class="text-neutral-400">Socials</h4>
            <ul class="mt-4 space-y-4">
              <li>
                <Link to="https://discord.gg/backtrack">Discord</Link>
              </li>
              <li>
                <Link to="https://twitter.com/spotistats">Twitter</Link>
              </li>
              <li>
                <Link to="https://www.instagram.com/spotistats">Instagram</Link>
              </li>
            </ul>
          </div>
        </div>
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h4 class="text-neutral-400">Legal</h4>
            <ul class="mt-4 space-y-4">
              <li>
                <Link :to="{ name: 'Privacy' }">Privacy</Link>
              </li>
              <li>
                <Link :to="{ name: 'Terms' }">Terms</Link>
              </li>
            </ul>
          </div>
          <div class="mt-10 md:mt-0">
            <h4 class="text-neutral-400">Download</h4>
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
          </div>
        </div>
      </div>
    </div>
    <p class="mt-10 pt-10 text-center md:mt-0 md:order-1">
      © 2021 Backtrack / Spotistats. All rights reserved. Made with ❤️ in the Netherlands
    </p>
  </Container>
</template>

<script lang="ts" setup>
import Container from '../layout/Container.vue';
import Button from '../base/Button.vue';
import Link from '../base/Link.vue';
</script>
