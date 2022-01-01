<template>
  <Header />
  <section>
    <Container class="flex justify-between flex-col gap-5 md:flex-row">
      <div class="w-full md:w-6/12 my-12 md:my-28">
        <h1 class="lg:text-6xl text-5xl font-bold">
          Your music,<br />
          <span class="opacity-30">your</span> stats,<br />
          <span class="opacity-30">your</span> story.
        </h1>
        <p class="text-xl my-5 max-w-prose">
          Enter a new dimension of music by getting unique insights into your music taste.
        </p>
        <ChevronLink :to="{ name: 'Gift' }">Watch the video</ChevronLink>
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
      <div class="w-full md:w-6/12 flex items-end">
        <img
          class="object-contain"
          src="https://cdn.discordapp.com/attachments/756495774975655987/925148729781153872/Frame_8.png"
          alt="Desktop Mobile"
        />
      </div>
    </Container>
  </section>
  <section class="bg-bodySecundary pt-28 pb-28">
    <Container class="flex justify-between flex-col md:flex-row gap-10">
      <div class="w-full hidden justify-center mb-5 md:w-6/12 md:flex">
        <img
          src="https://cdn.discordapp.com/attachments/756495774975655987/926242429022113802/Group_21.png"
          alt="app"
          class="w-60 md:w-auto object-contain transition-transform duration-200 hover:scale-[1.02]"
        />
      </div>
      <div class="w-full md:w-6/12">
        <h1 class="text-4xl font-bold">Easy, extensive and secure</h1>
        <p class="mt-2 max-w-prose text-neutral-400">
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
          <small class="text-textGrey"
            >*
            <Link :to="{ name: 'Import' }" class="underline">import of streaminghistory</Link> may
            be required to unlock (part of) this feature</small
          >
        </div>
        <Divider />
        <br />
        <TotalStats />
      </div>
    </Container>
  </section>
  <section>
    <Container class="pt-14 pb-14">
      <Card
        class="rounded-[2.5rem] overflow-hidden flex flex-col max-h-[575px] px-0 py-0 md:flex-row md:gap-5 md:max-h-[365px]"
      >
        <div class="flex flex-col justify-between w-full p-5 md:w-8/12 md:p-10 mb-10">
          <div>
            <h1 class="text-4xl font-bold">Lorem ipsum, <br />dolor samet</h1>
            <p class="mt-2 mb-2 max-w-prose text-xl">
              Lorem ipsum dolor samet, sit amet consecteteur
            </p>
          </div>
          <ChevronLink to="/">Watch the video</ChevronLink>
        </div>
        <div
          class="hidden md:flex w-[500px] gap-3 overflow-hidden translate-x-[75px] min-w-[350px]"
        >
          <div class="w-6/12 flex flex-col gap-5 translate-y-[-300px]">
            <img src="../assets/mobile_full.png" class="w-full" />
            <img src="../assets/mobile_full.png" class="w-full" />
          </div>
          <div class="w-6/12 flex flex-col gap-5 translate-y-[-150px]">
            <img src="../assets/mobile_full.png" class="w-full" />
            <img src="../assets/mobile_full.png" class="w-full" />
          </div>
        </div>
        <div class="flex justify-center pl-5 pr-5 md:hidden">
          <img src="../assets/mobile_full.png" />
        </div>
      </Card>

      <!-- TODO: responiveness -->
      <div class="mt-10 flex gap-10 max-h-[575px] md:max-h-[365px]">
        <Card class="rounded-[2.5rem] p-0 overflow-hidden hidden md:block">
          <div class="md:flex w-[500px] translate-x-[35px] gap-3 min-w-[350px]">
            <div class="w-6/12 flex flex-col gap-5 translate-y-[-300px]">
              <img src="../assets/mobile_full.png" class="w-full" />
              <img src="../assets/mobile_full.png" class="w-full" />
            </div>
            <div class="w-6/12 flex flex-col gap-5 translate-y-[-190px]">
              <img src="../assets/mobile_full.png" class="w-full" />
              <img src="../assets/mobile_full.png" class="w-full" />
            </div>
          </div>
          <div class="flex justify-center pl-5 pr-5 md:hidden">
            <img src="../assets/mobile_full.png" />
          </div>
        </Card>

        <Card
          class="rounded-[2.5rem] flex flex-col justify-between max-h-[575px] p-5 md:p-10 md:max-h-[365px]"
        >
          <h1 class="text-4xl font-bold">Lorem ipsum, <br />dolor samet</h1>
          <p class="mt-2 mb-2 max-w-prose text-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum hic quo totam quae
            ducimus quos odio consequuntur dolores earum perferendis.
          </p>
          <ChevronLink to="/">Watch the video</ChevronLink>
        </Card>
      </div>
    </Container>
  </section>
  <section class="bg-bodySecundary pt-14 pb-14 text-[black]">
    <Container>
      <Card
        class="bg-primary text-center px-6 py-10 flex flex-col transition-transform duration-200 hover:scale-[1.02] sm:px-12 sm:py-20"
      >
        <h1 class="text-4xl font-bold">Download today and start your journey</h1>
        <p class="mt-2 text-xl">Available on Android & iOS</p>
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

import {
  mdiLock,
  mdiHistory,
  mdiFormatListBulletedTriangle,
  mdiChartTimelineVariantShimmer
} from '@mdi/js';
</script>
