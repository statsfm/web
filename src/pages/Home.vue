<template>
  <Header />
  <section class="mt-28">
    <Container class="flex justify-between flex-col gap-5 md:flex-row">
      <div class="w-full md:w-6/12">
        <h1 class="text-6xl font-bold">Lorem ipsum, <br />dolor samet</h1>
        <p class="text-xl my-5 max-w-prose">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis a esse id rem quasi
          placeat, laudantium.
        </p>
        <a href="" class="text-primary font-bold">Watch the video -></a>
        <div class="flex gap-2 my-8 flex-col md:flex-row items-center">
          <a
            class="hover:scale-[1.02]"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
            ><img src="../assets/apple_appstore_badge.png" alt="Apple Appstore" class="h-14" />
          </a>
          <a
            class="hover:scale-[1.02]"
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
      <div class="w-full flex justify-center mb-5 md:w-6/12">
        <img
          src="../assets/mobile_full.png"
          alt="app"
          class="w-60 md:w-auto h-max transition-transform duration-200 hover:scale-[1.02]"
        />
      </div>
      <div class="w-full md:w-6/12">
        <h1 class="text-4xl font-bold">Lorem ipsum dolor samet</h1>
        <p class="mt-2 max-w-prose">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis a esse id rem quasi
          placeat, laudantium repellendus doloribus repudiandae suscipit pariatur accusantium
          aspernatur deserunt commodi. Doloremque odio perspiciatis mollitia.
        </p>
        <div class="flex flex-col gap-3 mt-3 mb-8">
          <FeatureStepItem
            :index="1"
            title="Lorem ipsum dolor samet"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          />
          <FeatureStepItem
            :index="2"
            title="Lorem ipsum dolor samet"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          />
          <FeatureStepItem
            :index="3"
            title="Lorem ipsum dolor samet"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          />
          <FeatureStepItem
            :index="4"
            title="Lorem ipsum dolor samet"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
          />
        </div>
        <Divider />
        <br />
        <TotalStats />
      </div>
    </Container>
  </section>
  <section class="bg-primary text-[black] pt-8 pb-8 relative">
    <Container class="absolute min-h-[185px]">
      <div class="flex items-center gap-10">
        <div class="w-full md:w-6/12">
          <h1 class="text-4xl font-bold">Lorem ipsum dolor samet</h1>
          <p>Lorem ipsum dolor samet</p>

          <div class="flex gap-8 mt-5">
            <h3 class="text-3xl font-bold">4.792 <span class="text-xl">rating</span></h3>

            <h3 class="text-3xl font-bold">43.284 <span class="text-xl">reviews</span></h3>
          </div>
        </div>

        <div class="w-6/12 min-h-[150px]"></div>
      </div>
    </Container>
    <div class="absolute" style="top: 32px">
      <div class="flex items-center gap-10">
        <div class="w-full md:w-6/12"></div>

        <div class="hidden md:flex w-6/12 gap-5 overflow-x-auto rounded-2xl">
          <Review
            title="Amazing!"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis a esse id rem "
            author="Sjoerd"
            date="2021-12-15T18:34:05+0000"
          />

          <Review
            title="Amazing!"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis a esse id rem quasi placeat, laudantium repellendus doloribus repudiandae suscipit pariatur."
            author="Martijn"
            date="2021-03-09T10:21:15+0000"
          />

          <Review
            title="Amazing!"
            description="Lorem ipsum laudantium repellendus doloribus repudiandae suscipit pariatur."
            author="Stijn"
            date="2020-10-29T07:07:16+0000"
          />

          <Review
            title="Amazing!"
            description="Lorem ipsum laudantium repellendus doloribus repudiandae suscipit pariatur."
            author="Stijn"
            date="2020-10-29T07:07:16+0000"
          />

          <Review
            title="Amazing!"
            description="Lorem ipsum laudantium repellendus doloribus repudiandae suscipit pariatur."
            author="Stijn"
            date="2020-10-29T07:07:16+0000"
          />
        </div>
      </div>
    </div>
  </section>
  <section>
    <Container class="pt-14 pb-14">
      <Card
        class="rounded-xxxl overflow-hidden flex flex-col max-h-[575px] px-0 py-0 md:flex-row md:gap-5 md:max-h-[365px]"
      >
        <div class="flex flex-col justify-between w-full p-5 md:w-8/12 md:p-10 mb-10">
          <div>
            <h1 class="text-4xl font-bold">Lorem ipsum, <br />dolor samet</h1>
            <p class="mt-2 mb-2 max-w-prose text-xl">
              Lorem ipsum dolor samet, sit amet consecteteur
            </p>
          </div>
          <a href="" class="text-primary font-bold">Watch the video -></a>
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
    </Container>
  </section>
  <section class="bg-bodySecundary pt-14 pb-14 text-[black]">
    <Container>
      <Card
        class="bg-primary text-center px-6 py-10 flex flex-col transition-transform duration-200 sm:px-12 sm:py-20 hover:scale-105"
      >
        <h1 class="text-4xl font-bold">Lorem ipsum dolar samet</h1>
        <p class="mt-2 text-xl">Download today</p>

        <div class="flex gap-2 flex-col justify-center md:flex-row items-center mt-8">
          <a
            class="hover:scale-[1.02]"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
            ><img src="../assets/apple_appstore_badge.png" alt="Apple Appstore" class="h-14" />
          </a>
          <a
            class="hover:scale-[1.02]"
            href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
            target="blank"
            ><img src="../assets/google_play_badge.png" alt="Google Play" class="h-14" />
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
import FeatureStepItem from '~/components/base/FeatureStepItem.vue';
import Review from '~/components/base/Review.vue';
import TotalStats from '~/components/base/TotalStats/TotalStats.vue';
</script>
