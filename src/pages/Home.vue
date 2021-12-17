<template>
  <section class="mt-28 mb-28">
    <Container class="flex justify-between flex-col md:flex-row">
      <div>
        <h1 class="text-5xl font-bold">Lorem ipsum, <br />dolor samet</h1>
        <p class="leading-5 mt-2 mb-2 max-w-prose">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis
          a esse id rem quasi placeat, laudantium.
        </p>
        <a href="" class="text-primary font-bold">Watch the video -></a>
        <div class="flex gap-2 mt-6 flex-col md:flex-row items-center mb-5">
          <a
            class="w-[145px]"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
            ><img
              src="../assets/apple_appstore_badge.png"
              alt="Apple Appstore"
            />
          </a>
          <a
            class="w-[145px]"
            href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
            target="blank"
            ><img src="../assets/google_play_badge.png" alt="Google Play" />
          </a>
        </div>
      </div>
      <div>
        <img src="../assets/home_desktop_mobile.png" alt="Desktop Mobile" />
      </div>
    </Container>
  </section>
  <section class="bg-bodySecundary pt-28 pb-28">
    <Container class="flex justify-between flex-col md:flex-row gap-10">
      <div class="w-full flex justify-center mb-5 md:w-6/12">
        <img
          src="../assets/mobile_full.png"
          alt="app"
          class="
            w-60
            md:w-auto
            h-max
            transition-transform
            duration-200
            hover:scale-[1.02]
          "
        />
      </div>
      <div class="w-full md:w-6/12">
        <h1 class="text-4xl font-bold">Lorem ipsum dolor samet</h1>
        <p class="mt-2 max-w-prose">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, corporis
          a esse id rem quasi placeat, laudantium repellendus doloribus
          repudiandae suscipit pariatur accusantium aspernatur deserunt commodi.
          Doloremque odio perspiciatis mollitia.
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
        <div class="mt-5 grid grid-cols-2 gap-2">
          <div class="leading-3">
            <span class="text-textGrey font-bold">Streams</span>
            <h4 class="text-2xl font-bold relative max-w-max">
              <span class="truncate w-auto block">1,243,232,244</span>
              <div
                class="
                  w-3
                  h-3
                  bg-primary
                  rounded-full
                  absolute
                  top-0
                  right-[-8px]
                "
              >
                <div class="w-3 h-3 bg-primary/50 animate-ping rounded-full">
                  <div
                    class="w-3 h-3 bg-primary/25 animate-pulse rounded-full"
                  ></div>
                </div>
              </div>
            </h4>
          </div>

          <div class="leading-3">
            <span class="text-textGrey font-bold">Users</span>
            <h4 class="text-2xl font-bold truncate">1,243,232,244</h4>
          </div>

          <div class="leading-3">
            <span class="text-textGrey font-bold">Artists</span>
            <h4 class="text-2xl font-bold truncate">1,243,232,244</h4>
          </div>

          <div class="leading-3">
            <span class="text-textGrey font-bold">Albums</span>
            <h4 class="text-2xl font-bold truncate">1,243,232,244</h4>
          </div>

          <div class="leading-3">
            <span class="text-textGrey font-bold">Tracks</span>
            <h4 class="text-2xl font-bold truncate">1,243,232,244</h4>
          </div>

          <div class="leading-3">
            <span class="text-textGrey font-bold">Genres</span>
            <h4 class="text-2xl font-bold truncate">1,243,232,244</h4>
          </div>
        </div>
      </div>
    </Container>
  </section>
  <section class="bg-primary text-[black] pt-8 pb-8">
    <Container class="flex items-center gap-10">
      <div class="w-full md:w-6/12">
        <h1 class="text-4xl font-bold">Lorem ipsum dolor samet</h1>
        <p>Lorem ipsum dolor samet</p>

        <div class="flex gap-8 mt-5">
          <h3 class="text-3xl font-bold">
            4.792 <span class="text-xl">rating</span>
          </h3>

          <h3 class="text-3xl font-bold">
            43.284 <span class="text-xl">reviews</span>
          </h3>
        </div>
      </div>

      <div class="hidden md:flex w-6/12 gap-5 overflow-x-auto">
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
      </div>
    </Container>
  </section>
  <section>
    <Container class="pt-14 pb-14">
      <Card
        class="
          rounded-xxxl
          overflow-hidden
          flex flex-col
          max-h-[575px]
          md:flex-row md:gap-5 md:max-h-[365px]
          sm:p-0
        "
      >
        <div class="p-12 flex flex-col justify-between w-full md:w-8/12">
          <div>
            <h1 class="text-4xl font-bold">Lorem ipsum, <br />dolor samet</h1>
            <p class="mt-2 mb-2 max-w-prose text-xl">
              Lorem ipsum dolor samet, sit amet consecteteur
            </p>
          </div>
          <a href="" class="text-primary font-bold">Watch the video -></a>
        </div>
        <div
          class="
            hidden
            md:flex
            w-[500px]
            gap-3
            overflow-hidden
            translate-x-[75px]
            min-w-[350px]
          "
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
        class="
          bg-primary
          text-center
          p-14
          flex flex-col
          transition-transform
          duration-200
          hover:scale-[1.02]
        "
      >
        <h1 class="text-4xl font-bold">Lorem ipsum dolar samet</h1>
        <p class="mt-2 text-xl">Download today</p>

        <div
          class="
            flex
            gap-2
            flex-col
            justify-center
            md:flex-row
            items-center
            mt-8
          "
        >
          <img
            src="../assets/apple_appstore_badge.png"
            alt="Apple Appstore"
            class="w-[145px]"
          />
          <img
            src="../assets/google_play_badge.png"
            alt="Google Play"
            class="w-[155px]"
          />
        </div>
      </Card>
    </Container>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Container from "~/components/layout/Container.vue";
import Card from "~/components/layout/Card.vue";
import Divider from "~/components/base/Divider.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import FeatureStepItem from "~/components/base/FeatureStepItem.vue";
import Review from "~/components/base/Review.vue";

export default defineComponent({
  components: {
    Container,
    Card,
    Divider,
    Text,
    Button,
    FeatureStepItem,
    Review,
  },
});
</script>
