<template>
  <div class="relative w-[400px] h-[400px]">
    <canvas ref="canvas" class="absolute"></canvas>
    <AudioFeatureBubble
      v-for="(feature, index) in featuresWithPos"
      :key="index"
      :feature="feature"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { useAuth } from '~/hooks';
import * as statsfm from '@statsfm/statsfm.js';

import {
  mdiMusic,
  mdiGuitarAcoustic,
  mdiLightningBolt,
  mdiInstrumentTriangle,
  mdiAccountVoice,
  mdiEmoticonHappy,
  mdiRecord
} from '@mdi/js';
import { AudioFeature } from './feature';
import AudioFeatureBubble from './AudioFeatureBubble.vue';
import { Point } from '~/types/point';

const props = defineProps<{
  topTracks: statsfm.Track[];
}>();

const emit = defineEmits<{
  (event: 'features', payload: AudioFeature[]): void;
}>();

const auth = useAuth();

const canvas: Ref<HTMLCanvasElement | undefined> = ref();

const getAudioFeatures = async (): Promise<AudioFeature[]> => {
  const tracks = props.topTracks;

  // TODO: improve
  let features: AudioFeature[] = [
    {
      label: 'acousticness',
      icon: mdiGuitarAcoustic,
      value: 0
    },
    {
      label: 'danceability',
      icon: mdiMusic,
      value: 0
    },
    {
      label: 'energy',
      icon: mdiLightningBolt,
      value: 0
    },
    {
      label: 'instrumentalness',
      icon: mdiInstrumentTriangle,
      value: 0
    },
    {
      label: 'liveness',
      icon: mdiRecord,
      value: 0
    },
    {
      label: 'speechiness',
      icon: mdiAccountVoice,
      value: 0
    },
    {
      label: 'valence',
      icon: mdiEmoticonHappy,
      value: 0
    }
  ];

  if (tracks && tracks.length > 0) {
    const spotifyIds = tracks.map((track) => (track.externalIds.spotify as string[])[0]);
    // todo: add this endpoint to api

    // const token = await auth.getSpotifyToken();

    // const res = await fetch(
    //   `https://api.spotify.com/v1/audio-features?ids=${spotifyIds.slice(0, 10).join(',')}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   }
    // );

    // if (res.ok) {
    //   const json = await res.json();
    //   const data: Record<string, number>[] = json.audio_features;

    //   for (const audioFeature of data) {
    //     for (let i = 0; i < features.length; i++) {
    //       features[i].value += audioFeature[features[i].label];
    //     }
    //   }

    //   for (let i = 0; i < features.length; i++) {
    //     features[i].value = features[i].value / features.length;
    //   }
    // }
  }

  return features;
};

const featuresWithPos: Ref<{ point: Point; feature: AudioFeature }[]> = ref([]);

onMounted(async () => {
  const features = await getAudioFeatures();
  emit('features', features);
  drawRadarChart(features);
});

const drawRadarChart = (features: AudioFeature[]) => {
  if (canvas.value) {
    // TODO: resposiveness
    canvas.value.width = 400;
    canvas.value.height = 400;
    const width = ref(canvas.value.width);
    const height = ref(canvas.value.height);

    const strokeWidth = 2;
    const maxDiameter = Math.min(width.value / 2, height.value / 2);
    const radius = maxDiameter / 3 - strokeWidth;
    const centerPoint: Point = { x: width.value / 2, y: height.value / 2 };

    const deltaAngle = (Math.PI * 2) / features.length;

    const ctx = canvas.value?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = 'rgb(39,41,43)';
      ctx.lineWidth = strokeWidth;

      // draw the spider web
      for (let i = 0; i <= 3; i++) {
        ctx.beginPath();
        ctx.ellipse(width.value / 2, height.value / 2, radius * i, radius * i, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
      }

      // draw the crosshair
      for (let i = 0; i < features.length; i++) {
        const angle = deltaAngle * i;
        const crosshair: Point = {
          x: centerPoint.x + (maxDiameter - strokeWidth * 2) * Math.cos(angle),
          y: centerPoint.y + (maxDiameter - strokeWidth * 2) * Math.sin(angle)
        };

        ctx.beginPath();
        ctx.moveTo(centerPoint.x, centerPoint.y);
        ctx.lineTo(crosshair.x, crosshair.y);
        ctx.stroke();
        ctx.closePath();
      }

      let maxRadius = -Infinity;
      let minRadius = Infinity;
      for (const feature of features) {
        maxRadius = Math.max(maxRadius, feature.value);
        minRadius = Math.min(minRadius, feature.value);
      }

      // TODO: move this outside the draw function
      // calculate the positions
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const ratio = (feature.value - minRadius) / (maxRadius - minRadius);
        const featureRadius = maxDiameter * ratio;

        const angle = deltaAngle * i;
        const pos: Point = {
          x: centerPoint.x + featureRadius * Math.cos(angle),
          y: centerPoint.y + featureRadius * Math.sin(angle)
        };

        featuresWithPos.value.push({
          point: {
            x: pos.x,
            y: pos.y
          },
          feature
        });
      }

      // draw the lines between the points and fill it
      ctx.beginPath();
      for (let i = 0; i <= featuresWithPos.value.length; i++) {
        if (i == 0) {
          const startPos = featuresWithPos.value[0];
          ctx.moveTo(startPos.point.x, startPos.point.y);
        } else {
          const index = i == featuresWithPos.value.length ? 0 : i;
          const pos = featuresWithPos.value[index];

          ctx.strokeStyle = 'rgb(30, 215, 96)';
          ctx.lineWidth = strokeWidth;
          ctx.fillStyle = 'rgba(30, 215, 96, 0.2)';
          ctx.lineTo(pos.point.x, pos.point.y);
          ctx.stroke();
        }
      }
      ctx.closePath();
      ctx.fill();
    }
  }
};
</script>
