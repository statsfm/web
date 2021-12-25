<template>
  <canvas ref="canvas" class="absolute top-0 -z-50" />
  <div class="grid place-items-center h-screen">
    <div class="-mt-64 text-center" ref="content">
      <h1 class="text-7xl font-bold mb-2">Whoops...</h1>
      <p class="font-bold text-textGrey mb-5">this page is not available</p>
      <router-link :to="{ name: 'Home' }">
        <Button>Back to homepage</Button>
      </router-link>
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

    type Point = {
      x: number;
      y: number;
    };

    type Circle = {
      point: Point;
      radius: number;
    };

    const strokeWidth = 50;
    const minRadius = window.innerWidth / 15;
    const margin = minRadius + 5;
    const artists: Ref<Circle[]> = ref([]);

    let index = 0;
    let continueCount = 0;

    onMounted(() => {
      if (canvas.value) {
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;

        const ctx = canvas.value.getContext("2d");
        const canvasSize: Point = {
          x: canvas.value.width,
          y: canvas.value.height,
        };
        const bounding = content.value?.getBoundingClientRect();

        if (ctx && content.value && bounding) {
          const bbX = (bounding.left + bounding.right) / 2;
          const bbY = (bounding.top + bounding.bottom) / 2;
          const bbR = bounding.right - bbX;
          const bbC: Circle = { point: { x: bbX, y: bbY }, radius: bbR };

          while (artists.value.length < images.length) {
            const randomPoint = getRandomPositionInRange(canvasSize);

            if (
              continueCount < 100 &&
              randomPoint.x > bounding.left - minRadius &&
              randomPoint.x < bounding.right + minRadius &&
              randomPoint.y > bounding.top - minRadius &&
              randomPoint.y < bounding.bottom + minRadius
            ) {
              continueCount++;
              continue;
            }

            let maxRadius = minRadius * 2.5;

            for (const artist of artists.value) {
              maxRadius = getMaxDistance(
                randomPoint,
                artist,
                maxRadius,
                margin
              );
            }

            maxRadius = getMaxDistance(randomPoint, bbC, maxRadius, margin);

            if (maxRadius > minRadius) {
              const radius = getRandomIntInRange(minRadius, maxRadius);

              artists.value.push({ point: randomPoint, radius });

              const img = new Image(radius, radius);
              img.src = images[index];

              index++;

              img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.ellipse(
                  randomPoint.x,
                  randomPoint.y,
                  radius,
                  radius,
                  0,
                  0,
                  Math.PI * 2
                );
                ctx.lineWidth = strokeWidth;
                ctx.strokeStyle = "rgba(24, 24, 28, 1)";
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(
                  randomPoint.x,
                  randomPoint.y,
                  radius + 25,
                  radius + 25,
                  0,
                  0,
                  Math.PI * 2
                );
                ctx.lineWidth = strokeWidth;
                ctx.strokeStyle = "rgba(24, 24, 28, 0.5)";
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.beginPath();
                ctx.arc(
                  randomPoint.x,
                  randomPoint.y,
                  radius,
                  0,
                  Math.PI * 2,
                  true
                );
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(
                  img,
                  randomPoint.x - radius,
                  randomPoint.y - radius,
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

    const getMaxDistance = (
      point: Point,
      target: Circle,
      maxRadius: number,
      margin: number
    ): number => {
      const deltaX = target.point.x - point.x;
      const deltaY = target.point.y - point.y;
      let distance = 0;

      distance = Math.floor(
        Math.sqrt(deltaX * deltaX + deltaY * deltaY) - target.radius - margin
      );

      if (distance < maxRadius) {
        maxRadius = distance;
      }

      return maxRadius;
    };

    const getRandomPositionInRange = (point: Point): Point => {
      return {
        x: getRandomIntInRange(0, point.x),
        y: getRandomIntInRange(0, point.y),
      };
    };

    const getRandomIntInRange = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    return { canvas, content };
  },
});
</script>
