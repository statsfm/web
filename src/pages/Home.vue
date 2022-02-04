<template>
  <Header />
  <section>
    <Container class="flex justify-between flex-col gap-5 lg:flex-row relative">
      <div class="w-full lg:w-5/12 my-12 lg:my-28 pt-10">
        <h1 class="text-5xl">
          Your music,<br />
          <span class="opacity-30 font-extrabold">your</span> stats,<br />
          <span class="opacity-30 font-extrabold">your</span> story.
        </h1>
        <p class="mb-5">
          Enter a new dimension of music by getting unique insights into your music taste.
        </p>
        <!-- <ChevronLink :to="{ name: 'Gift' }">Watch the video</ChevronLink> -->
        <ChevronLink to="https://youtu.be/_4EFJJOXh_0">Watch the video</ChevronLink>
        <div class="flex gap-2 mt-8 flex-col md:flex-row items-center">
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
      <div class="w-full lg:w-7/12 flex items-end mb-10">
        <img class="object-contain" src="../assets/images/app_3.webp" alt="Desktop Mobile" />
      </div>
    </Container>
  </section>
  <section class="bg-bodySecundary pt-28 pb-28 -mt-10">
    <Container class="flex justify-between flex-col lg:flex-row gap-10">
      <div class="w-full hidden justify-center mb-5 lg:w-6/12 lg:flex">
        <img
          src="../assets/images/app_2.webp"
          alt="app"
          class="w-60 lg:w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
        />
      </div>
      <div class="w-full lg:w-6/12">
        <h1>Easy, extensive and secure</h1>
        <p>
          With the click of a button you'll be logged with your Spotify account and you'll instantly
          gain access to a valhalla of cool stats and insights
        </p>
        <div class="flex flex-col gap-3 mt-5 mb-8">
          <FeatureItem :icon="mdiLock" title="Safe & secure"
            >Privacy is key, and I've build the platform keeping security and privacy at the highest
            priority. As far as possible, all data is saved anonymously, and is stored and
            transferred fully encrypted. Unless you import your streaminghistory no data is saved on
            the servers.</FeatureItem
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
            >Follow the unique import process to import your lifetime streaminghistory and unlock
            the full potential of the platform by getting access to lots of cool features. It's
            really cool, I promise : )</FeatureItem
          >
          <p>
            * <Link :to="{ name: 'Import' }">import of streaminghistory</Link> may be required to
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
        class="rounded-[2.5rem] overflow-hidden flex flex-col justify-between max-h-[575px] px-0 py-0 md:flex-row md:gap-5 md:max-h-[365px]"
      >
        <div class="flex flex-col justify-start w-full p-5 md:w-8/12 md:p-10">
          <h1>Connect with your friends</h1>
          <p class="text-xl font-normal">
            It's as easy as sharing a link to your profile to share your stats with friends.
            <br /><br />Send friend requests to your friends and if your friends' privacy settings
            allow it you'll be able to check their stats anytime.
          </p>
          <div class="h-full"></div>
          <ChevronLink :to="{ name: 'User', params: { id: 'sjoerdgaatwakawaka' } }"
            >Check out an example page</ChevronLink
          >
        </div>
        <div
          class="hidden md:flex w-[500px] gap-3 overflow-hidden translate-x-[75px] min-w-[350px]"
        >
          <div class="w-6/12 flex flex-col gap-5 translate-y-[-300px]">
            <img src="../assets/images/app_1.webp" class="w-full" />
            <img src="../assets/images/app_1.webp" class="w-full" />
          </div>
          <div class="w-6/12 flex flex-col gap-5 translate-y-[-150px]">
            <img src="../assets/images/app_1.webp" class="w-full" />
            <img src="../assets/images/app_1.webp" class="w-full" />
          </div>
        </div>
        <div class="flex justify-center pl-5 pr-5 md:hidden max-h-96 overflow-hidden">
          <img src="../assets/images/app_1.webp" class="h-full" />
        </div>
      </Card>

      <!-- TODO: responiveness -->
      <div class="mt-10 flex gap-10 max-h-[575px] md:max-h-[365px]">
        <Card class="rounded-[2.5rem] p-0 overflow-hidden hidden md:block">
          <div class="md:flex w-[500px] translate-x-[35px] gap-3 min-w-[350px]">
            <div class="w-6/12 flex flex-col gap-5 translate-y-[-300px]">
              <img src="../assets/images/app_1.webp" class="w-full" />
              <img src="../assets/images/app_1.webp" class="w-full" />
            </div>
            <div class="w-6/12 flex flex-col gap-5 translate-y-[-190px]">
              <img src="../assets/images/app_1.webp" class="w-full" />
              <img src="../assets/images/app_1.webp" class="w-full" />
            </div>
          </div>
          <div class="flex justify-center pl-5 pr-5 md:hidden">
            <img src="../assets/images/app_1.webp" />
          </div>
        </Card>

        <Card class="rounded-[2.5rem] max-h-[575px] p-5 md:p-10 md:max-h-[365px]">
          <div class="flex flex-col justify-start w-full">
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
        class="bg-primary text-center px-6 py-10 flex items-center flex-col transition-transform duration-200 hover:scale-[1.02] sm:px-12 sm:py-20"
      >
        <h1 class="text-bodySecundary">Download today and start your journey</h1>
        <h4 class="text-bodySecundary py-2">Available on Android & iOS</h4>
        <div class="flex gap-2 flex-col justify-center md:flex-row items-center mt-8">
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

useApi();
useAuth();

import {
  mdiLock,
  mdiHistory,
  mdiFormatListBulletedTriangle,
  mdiChartTimelineVariantShimmer
} from '@mdi/js';
</script>
