<template>
  <Container class="pt-14 pb-14">
    <div class="font-bold xl:grid xl:gap-8">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div v-for="(link, index) in links" :key="index">
          <h4 class="text-neutral-400">{{ link.label }}</h4>
          <ul class="mt-2 space-y-2">
            <li v-for="(link, index) in link.links" :key="index">
              <Link :to="link.to" class="text-[1rem]">{{ link.label }}</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-neutral-400">Download</h4>
          <div class="mt-4"></div>
          <a
            class="h-9"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
            ><img src="../../assets/apple_appstore_badge.png" alt="Apple Appstore" class="h-9" />
          </a>
          <div class="mt-2"></div>
          <a
            class="h-9"
            href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
            target="blank"
            ><img src="../../assets/google_play_badge.png" alt="Google Play" class="h-9" />
          </a>
        </div>
      </div>
    </div>
    <p class="mt-10 min-w-full pt-10 text-center text-neutral-500 md:order-1 md:mt-0">
      All copyrighted content (i.e. album artwork) on Stats.fm are owned by their respective owners.
      Data is provided by Spotify. Spotify is a trademark of Spotify AB. Stats.fm is in no wayaffiliated with Spotify.
    </p>
    <p class="mt-10 min-w-full pt-5 text-center md:order-1 md:mt-0">
      © 2022 Stats.fm / Spotistats for Spotify. All rights reserved. Made with ❤️ in the
      Netherlands.
    </p>
  </Container>
</template>

<script lang="ts" setup>
import Container from '../layout/Container.vue';
import Button from '../base/Button.vue';
import Link from '../base/Link.vue';
import { LocationAsRelativeRaw, useRouter } from 'vue-router';
import { onBeforeMount } from 'vue';

const router = useRouter();

const links: { label: string; links: { label: string; to: string | LocationAsRelativeRaw }[] }[] = [
  {
    label: 'Stats.fm',
    links: [
      {
        label: 'Home',
        to: { name: 'Home' }
      },
      {
        label: 'Support',
        to: 'https://support.stats.fm/'
      },
      {
        label: 'Beta program',
        to: { name: 'Beta' }
      }
    ]
  },
  {
    label: 'Socials',
    links: [
      {
        label: 'Discord',
        to: 'https://discord.gg/spotistats'
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
