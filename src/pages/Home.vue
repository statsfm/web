<template>
  <Header />
  <section>
    <Container class="relative flex flex-col justify-between gap-5 lg:flex-row">
      <div class="my-12 w-full pt-10 lg:my-28 lg:w-5/12">
        <h1 class="text-5xl">
          Your music,<br />
          <span class="font-extrabold opacity-30">your</span> stats,<br />
          <span class="font-extrabold opacity-30">your</span> story.
        </h1>
        <p class="mb-5">
          Enter a new dimension of music by getting unique insights into your music taste.
        </p>
        <!-- <ChevronLink :to="{ name: 'Gift' }">Watch the video</ChevronLink> -->
        <ChevronLink to="https://spotistats.app/plus-demo">Watch the video</ChevronLink>
        <div class="mt-8 flex flex-col items-center gap-2 md:flex-row">
          <a
            class="duration-100"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
            ><img src="../assets/apple_appstore_badge.png" alt="Apple Appstore" class="h-14" />
          </a>
          <a
            class="duration-100"
            href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
            target="blank"
            ><img src="../assets/google_play_badge.png" alt="Google Play" class="h-14" />
          </a>
        </div>
      </div>
      <div class="mb-10 flex w-full items-end lg:w-7/12">
        <img class="object-contain" src="../assets/images/app_3.webp" alt="Desktop Mobile" />
      </div>
    </Container>
  </section>
  <section class="-mt-10 bg-bodySecundary pt-28 pb-28">
    <Container class="flex flex-col justify-between gap-10 lg:flex-row">
      <div class="mb-5 hidden w-full justify-center lg:flex lg:w-6/12">
        <img
          src="../assets/images/app_2.webp"
          alt="app"
          class="w-60 object-contain transition-transform duration-200 hover:scale-[1.02] lg:w-auto"
        />
      </div>
      <div class="w-full lg:w-6/12">
        <h1>Easy, extensive and secure</h1>
        <p>
          With the click of a button you'll be logged with your Spotify account and you'll instantly
          gain access to a valhalla of cool stats and insights
        </p>
        <div class="mt-5 mb-8 flex flex-col gap-3">
          <FeatureItem :icon="mdiLock" title="Safe & secure"
            >Privacy is key, and I've build the platform keeping security and privacy at the highest
            priority. As far as possible, all data is saved anonymously, and is stored and
            transferred fully encrypted. Unless you import your streaming history no data is saved
            on the servers.</FeatureItem
          >
          <FeatureItem :icon="mdiChartTimelineVariantShimmer" title="Enhanced personalized stats">
            Thanks to state of the art algorithms you'll always be welcomed with relevant, advanced
            and personalized stats for each item you click on.</FeatureItem
          >
          <FeatureItem
            :icon="mdiFormatListBulletedTriangle"
            title="Top tracks, artists and albums at a glance*"
            >Of course most people are here to check their top lists, which becomes an amazing
            experience on this platform. For example: order the lists by times played, minutes
            streamed or by advanced machine learning!</FeatureItem
          >
          <FeatureItem :icon="mdiHistory" title="Import your lifetime history*"
            >Follow the unique import process to import your lifetime streaming history and unlock
            the full potential of the platform by getting access to lots of cool features. It's
            really cool, I promise : )</FeatureItem
          >
          <p>
            * <Link :to="{ name: 'Import' }">import of streaming history</Link> may be required to
            unlock (part of) this feature
          </p>
        </div>
        <Divider />
        <TotalStats class="mt-5" />
      </div>
    </Container>
  </section>
  <section>
    <Container class="pt-14 pb-14">
      <Card
        class="flex max-h-[575px] flex-col justify-between overflow-hidden rounded-[2.5rem] px-0 py-0 md:max-h-[365px] md:flex-row md:gap-5"
      >
        <div class="flex w-full flex-col justify-start p-5 md:w-8/12 md:p-10">
          <h1>Connect with your friends</h1>
          <p class="text-xl font-normal">
            It's as easy as sharing a link to your profile to share your stats with friends.
            <br /><br />Send friend requests to your friends and if your friends' privacy settings
            allow it you'll be able to check their stats anytime.
          </p>
          <div class="h-full"></div>
          <ChevronLink :to="{ name: 'User', params: { userId: 'sjoerdgaatwakawaka' } }"
            >Check out an example page</ChevronLink
          >
        </div>
        <div
          class="hidden w-[500px] min-w-[350px] translate-x-[75px] gap-3 overflow-hidden md:flex"
        >
          <div class="flex w-6/12 translate-y-[-300px] flex-col gap-5">
            <img
              src="../assets/images/app_1.webp"
              class="w-full transition-transform duration-200 hover:scale-[1.02]"
            />
            <img
              src="../assets/images/app_1.webp"
              class="w-full transition-transform duration-200 hover:scale-[1.02]"
            />
          </div>
          <div class="flex w-6/12 translate-y-[-150px] flex-col gap-5">
            <img
              src="../assets/images/app_1.webp"
              class="w-full transition-transform duration-200 hover:scale-[1.02]"
            />
            <img
              src="../assets/images/app_1.webp"
              class="w-full transition-transform duration-200 hover:scale-[1.02]"
            />
          </div>
        </div>
        <div class="flex max-h-96 justify-center overflow-hidden pl-5 pr-5 md:hidden">
          <img src="../assets/images/app_1.webp" class="h-full" />
        </div>
      </Card>

      <!-- TODO: responiveness -->
      <div class="mt-10 flex max-h-[575px] gap-10 md:max-h-[365px]">
        <Card class="hidden overflow-hidden rounded-[2.5rem] p-0 md:block">
          <div class="w-[500px] min-w-[350px] translate-x-[35px] gap-3 md:flex">
            <div class="flex w-6/12 translate-y-[-300px] flex-col gap-5">
              <img
                src="../assets/images/app_1.webp"
                class="w-full transition-transform duration-200 hover:scale-[1.02]"
              />
              <img
                src="../assets/images/app_1.webp"
                class="w-full transition-transform duration-200 hover:scale-[1.02]"
              />
            </div>
            <div class="flex w-6/12 translate-y-[-190px] flex-col gap-5">
              <img
                src="../assets/images/app_1.webp"
                class="w-full transition-transform duration-200 hover:scale-[1.02]"
              />
              <img
                src="../assets/images/app_1.webp"
                class="w-full transition-transform duration-200 hover:scale-[1.02]"
              />
            </div>
          </div>
          <div class="flex justify-center pl-5 pr-5 md:hidden">
            <img src="../assets/images/app_1.webp" />
          </div>
        </Card>

        <Card class="max-h-[575px] rounded-[2.5rem] p-5 md:max-h-[365px] md:p-10">
          <div class="flex w-full flex-col justify-start">
            <h1>Full control over your data</h1>
            <p class="text-xl font-normal">
              Don't want to share part of your stats/profile? Use the privacy settings to select
              which parts of your profile you want to share with others.
              <br /><br />Want me to delete all your data? No problem, you can do that anytime in
              your privacy settings.
            </p>
          </div>
          <!-- <div>
            <h1 class="text-primary lg:text-7xl text-6xl">#1</h1>
            <h1 class="lg:text-6xl text-5xl">Spotify stats app 2021</h1>
          </div>
          <h1 class="text-neutral-400 text-right lg:text-5xl text-4xl">in 2021</h1> -->
        </Card>
      </div>
    </Container>
  </section>
  <section class="bg-bodySecundary pt-14 pb-14 text-[black]">
    <Container>
      <Card
        class="flex flex-col items-center bg-primary px-6 py-10 text-center transition-transform duration-200 hover:scale-[1.02] sm:px-12 sm:py-20"
      >
        <h1 class="text-bodySecundary">Download today and start your journey</h1>
        <h4 class="py-2 text-bodySecundary">Available on Android & iOS</h4>
        <div class="mt-8 flex flex-col items-center justify-center gap-2 md:flex-row">
          <a
            class="duration-100"
            href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
            target="blank"
            ><img src="../assets/google_play_badge.png" alt="Google Play" class="h-14" />
          </a>
          <a
            class="duration-100"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
            ><img src="../assets/apple_appstore_badge.png" alt="Apple Appstore" class="h-14" />
          </a>
        </div>
      </Card>
    </Container>
  </section>
</template>

<script lang="ts" setup>
import Header from '~/components/layout/Header.vue';
import Container from '~/components/layout/Container.vue';
import Card from '~/components/layout/Card.vue';
import Divider from '~/components/base/Divider.vue';
import FeatureItem from '~/components/base/FeatureItem.vue';
import TotalStats from '~/components/base/TotalStats/TotalStats.vue';
import ChevronLink from '~/components/base/ChevronLink.vue';
import Link from '~/components/base/Link.vue';
import { useApi, useAuth } from '~/hooks';

import {
  mdiLock,
  mdiHistory,
  mdiFormatListBulletedTriangle,
  mdiChartTimelineVariantShimmer
} from '@mdi/js';

useApi();
useAuth();
</script>
