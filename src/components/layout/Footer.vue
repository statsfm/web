<template>
  <Container class="pt-14 pb-14">
    <div class="xl:grid xl:gap-8 font-bold">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div v-for="(link, index) in links" :key="index">
          <h4 class="text-neutral-400">{{ link.label }}</h4>
          <ul class="mt-4 space-y-4">
            <li v-for="(link, index) in link.links" :key="index">
              <Link :to="link.to">{{ link.label }}</Link>
            </li>
          </ul>
        </div>

        <div>
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
    <p class="min-w-full mt-10 pt-10 text-center md:mt-0 md:order-1">
      © 2021 Backtrack / Spotistats. All rights reserved. Made with ❤️ in the Netherlands
    </p>
  </Container>
</template>

<script lang="ts" setup>
import Container from '../layout/Container.vue';
import Button from '../base/Button.vue';
import Link from '../base/Link.vue';

const links = [
  {
    label: 'Backtrack',
    links: [
      {
        label: 'Home',
        to: { name: 'Home' }
      },
      {
        label: 'Support',
        to: 'https://support.spotistats.app/'
      }
    ]
  },
  {
    label: 'Socials',
    links: [
      {
        label: 'Discord',
        to: 'https://discord.gg/backtrack'
      },
      {
        label: 'Twitter',
        to: 'https://twitter.com/spotistats'
      },
      {
        label: 'Instagram',
        to: 'https://instagram.com/spotistats'
      }
    ]
  },
  {
    label: 'Legal',
    links: [
      {
        label: 'Privacy',
        to: { name: 'Privacy' }
      },
      {
        label: 'Terms',
        to: { name: 'Terms' }
      }
    ]
  }
];
</script>
