<template>
  <Header />
  <canvas ref="canvas" class="absolute top-0 -z-50" />
  <div class="grid place-items-center h-screen" @click="onCanvasClick">
    <div class="-mt-64 text-center" ref="content">
      <h1 class="text-7xl font-bold mb-2">Whoops...</h1>
      <p class="font-bold text-textGrey mb-5">this page is not available</p>
      <router-link :to="{ name: 'Home' }">
        <Button>Back to homepage</Button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';

import Header from '~/components/layout/Header.vue';
import Button from '~/components/base/Button.vue';
import { useRouter } from 'vue-router';
import { BacktrackArtist } from '~/types/backtrack';
import { Point } from '~/types';

const router = useRouter();

const content: Ref<HTMLDivElement | undefined> = ref();
const canvas: Ref<HTMLCanvasElement | undefined> = ref();
const artistBubbles: Ref<Circle[]> = ref([]);
const artists: Ref<BacktrackArtist[]> = ref([]);

type Circle = {
  point: Point;
  radius: number;
};

const strokeWidth = 50;
const minRadius = window.innerWidth / 15;
const margin = minRadius + strokeWidth + 5;

let continueCount = 0;

onMounted(async () => {
  artists.value = (await getTopArtists()).sort((a, b) =>
    a.spotifyPopularity < b.spotifyPopularity ? -1 : 0
  );

  if (canvas.value) {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;

    const canvasSize: Point = {
      x: canvas.value.width,
      y: canvas.value.height
    };

    const bounding = content.value?.getBoundingClientRect();
    if (content && bounding) {
      const boundingX = (bounding.left + bounding.right) / 2;
      const boundingY = (bounding.top + bounding.bottom) / 2;
      const boundingRadius = bounding.right - boundingX;
      const boundingCircle: Circle = {
        point: { x: boundingX, y: boundingY },
        radius: boundingRadius
      };

      while (artistBubbles.value.length < artists.value.length) {
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

        for (const artist of artistBubbles.value) {
          maxRadius = getMaxDistance(randomPoint, artist, maxRadius, margin);
        }

        maxRadius = getMaxDistance(randomPoint, boundingCircle, maxRadius, margin);

        if (maxRadius > minRadius) {
          const radius = getRandomIntInRange(minRadius, maxRadius);
          artistBubbles.value.push({ point: randomPoint, radius });
        }
      }

      let index = 0;
      artistBubbles.value.sort((a, b) => (a.radius < b.radius ? -1 : 0));
      artistBubbles.value.forEach((artist) => {
        drawArtistBubble(artist.point, artist.radius, artists.value[index]);
        index++;
      });
    }
  }
});

const getTopArtists = async (): Promise<BacktrackArtist[]> => {
  return await fetch('/global_top_artists.json').then((res) => res.json());
};

const drawArtistBubble = (point: Point, radius: number, artist: BacktrackArtist) => {
  const ctx = canvas.value?.getContext('2d');

  if (canvas && ctx) {
    const img = new Image(radius, radius);
    img.src = artist.image;

    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(point.x, point.y, radius, radius, 0, 0, Math.PI * 2);
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = 'rgba(24, 24, 28, 1)';
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(point.x, point.y, radius + 25, radius + 25, 0, 0, Math.PI * 2);
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = 'rgba(24, 24, 28, 0.5)';
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, point.x - radius, point.y - radius, img.width * 2, img.height * 2);

      ctx.restore();
    };
  }
};

const getDistance = (point: Point, target: Circle): number => {
  const deltaX = target.point.x - point.x;
  const deltaY = target.point.y - point.y;

  return Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) - target.radius);
};

const getMaxDistance = (
  point: Point,
  target: Circle,
  maxRadius: number,
  margin: number
): number => {
  const distance = getDistance(point, target) - margin;

  if (distance < maxRadius) {
    maxRadius = distance;
  }

  return maxRadius;
};

const getRandomPositionInRange = (point: Point): Point => {
  return {
    x: getRandomIntInRange(0, point.x),
    y: getRandomIntInRange(0, point.y)
  };
};

const getRandomIntInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const getMousePosInElement = (el: HTMLCanvasElement, e: MouseEvent): Point => {
  const rect = el.getBoundingClientRect();

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

const onCanvasClick = (e: MouseEvent) => {
  if (canvas.value) {
    const mousePos = getMousePosInElement(canvas.value, e);

    for (let i = 0; i < artistBubbles.value.length; i++) {
      const bubble = artistBubbles.value[i];
      const artist = artists.value[i];
      const distance = getDistance(mousePos, bubble);

      if (distance <= bubble.radius) {
        router.push({
          name: 'Artist',
          params: { id: artist.id, slug: '' } // TODO: generate slug or get it by the api
        });
      }
    }
  }
};
</script>
