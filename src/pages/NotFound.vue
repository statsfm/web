<template>
  <canvas ref="canvas" class="absolute -z-50" />
  <div class="grid place-items-center">
    <div ref="content" class="max-w-max max-h-max">
      <Container class="h-screen grid place-items-center">
        <div class="-mt-64 text-center">
          <h1 class="text-7xl font-bold mb-2">Whoops...</h1>
          <p class="font-bold text-textGrey mb-5">this page is not available</p>
          <router-link :to="{ name: 'Home' }">
            <Button>Back to homepage</Button>
          </router-link>
        </div>
      </Container>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

import Container from "~/components/layout/Container.vue";
import Button from "~/components/base/Button.vue";

export default defineComponent({
  components: {
    Container,
    Button,
  },
  setup() {
    const content: Ref<HTMLDivElement | undefined> = ref();
    const canvas: Ref<HTMLCanvasElement | undefined> = ref();

    // fetch these images from an api
    const images = [
      "https://i.scdn.co/image/ccbe7b4fef679f821988c78dbd4734471834e3d9",
      "https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6",
      "https://i.scdn.co/image/ab6761610000e5ebd42a27db3286b58553da8858",
      "https://i.scdn.co/image/ab6761610000e5eb8ae7f2aaa9817a704a87ea36",
      "https://i.scdn.co/image/ab6761610000e5eb70783ea42c106f3f325f53af",
    ];

    const minRadius = 100;
    const margin = minRadius + 5;
    const artists: Ref<{ x: number; y: number; radius: number }[]> = ref([]);

    let index = 0;

    onMounted(() => {
      if (canvas.value) {
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;

        const ctx = canvas.value.getContext("2d");

        if (ctx && content.value) {
          while (artists.value.length < images.length) {
            const { x, y } = getRandomPositionInRange(
              canvas.value.width,
              canvas.value.height
            );

            const bounding = content.value?.getBoundingClientRect();

            if (
              x > bounding.left - minRadius &&
              x < bounding.right + minRadius &&
              y > bounding.top - minRadius &&
              y < bounding.bottom + minRadius
            ) {
              continue;
            }

            let maxRadius = 200;

            for (const artist of artists.value) {
              const deltaX = x - artist.x;
              const deltaY = y - artist.y;
              let distance = 0;

              distance = Math.floor(
                Math.sqrt(deltaX * deltaX + deltaY * deltaY) -
                  artist.radius -
                  margin
              );

              if (distance < maxRadius) {
                maxRadius = distance;
              }
            }

            if (maxRadius > minRadius) {
              const radius = getRandomIntInRange(minRadius, maxRadius);

              artists.value.push({ x, y, radius });

              const img = new Image(radius, radius);
              img.src = images[index];

              index++;

              img.onload = () => {
                ctx.save();

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2, true);

                ctx.closePath();
                ctx.clip();
                ctx.fill();

                ctx.drawImage(
                  img,
                  x - radius,
                  y - radius,
                  img.width * 2,
                  img.height * 2
                );

                ctx.restore();
              };
            }
          }
        }
      }
    });

    const getRandomPositionInRange = (x: number, y: number) => {
      return { x: getRandomIntInRange(0, x), y: getRandomIntInRange(0, y) };
    };

    const getRandomIntInRange = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    return { canvas, content };
  },
});
</script>
