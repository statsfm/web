<template>
  <div class="grid min-h-[500px] w-full grid-flow-col grid-cols-2 grid-rows-2 gap-10">
    <div class="col-span-1 row-span-2 grid-rows-2 gap-10" v-if="audioFeatures && _features">
      <div class="row-span-1">
        <div class="grid w-full grid-flow-col grid-rows-2 items-stretch gap-4">
          <div
            v-for="genre in _features?.sort((g1: any, g2: any) => g2.value - g1.value)"
            class="group col-span-1 row-span-1 w-full"
          >
            <label
              :aria-label="genre.label"
              for="progress"
              class="text-lg capitalize text-neutral-400 group-hover:text-white"
              >{{ genre.label }}</label
            >
            <div name="progress" class="mt-1 h-2 w-full overflow-hidden rounded bg-bodySecundary">
              <div
                :style="{ width: `${genre.value * 100}%` }"
                class="h-full rounded bg-primary"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-1 mt-8">
        <div class="grid basis-1/2 grid-cols-2 gap-2 md:grid-cols-3">
          <StatsCard :label="t('track.overall_loudness')">
            {{ audioFeatures.loudness }}
          </StatsCard>

          <StatsCard :label="t('track.key')" v-if="audioFeatures.key >= 0">
            {{ keyToNote(audioFeatures.key) }}
          </StatsCard>

          <StatsCard :label="t('track.mode')" v-if="audioFeatures.mode >= 0">
            {{ audioFeatures.mode == 0 ? 'Minor' : 'Major' }}
          </StatsCard>

          <StatsCard :label="t('track.time_signature')">
            {{ audioFeatures.time_signature }}/4
          </StatsCard>

          <StatsCard label="BPM">
            {{ audioFeatures.tempo }}
          </StatsCard>
        </div>
      </div>
    </div>
    <div class="col-span-1 row-span-2" v-if="featuresWithPos">
      <div class="relative h-[400px] w-[400px]">
        <canvas ref="canvas" class="absolute"></canvas>
        <AudioFeatureBubble
          v-for="(feature, index) in featuresWithPos"
          :key="index"
          :feature="feature"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  mdiAccountVoice,
  mdiEmoticonHappy,
  mdiGuitarAcoustic,
  mdiInstrumentTriangle,
  mdiLightningBolt,
  mdiMusic,
  mdiRecord
} from '@mdi/js';
import * as statsfm from '@statsfm/statsfm.js';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import StatsCard from '~/components/base/StatsCard.vue';
import { useApi, useAuth } from '~/hooks';
import { Point } from '~/types/point';
import AudioFeatureBubble from './AudioFeatureBubble.vue';
import { AudioFeature } from './feature';

const props = defineProps<{
  topTracks: statsfm.Track[];
}>();

const emit = defineEmits<{
  (event: 'features', payload: AudioFeature[]): void;
}>();

const { t } = useI18n();
const auth = useAuth();
const api = useApi();

const audioFeatures: Ref<statsfm.AudioFeatures | null> = ref(null);
const _features: Ref<AudioFeature[] | null> = ref(null);

const canvas: Ref<HTMLCanvasElement | undefined> = ref();

const keyToNote = (key: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes[key];
};

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
    const data = await (
      await api.http.get('/spotify/audio-features', {
        query: { ids: spotifyIds.slice(0, 10).join(',') }
      })
    ).data.items;

    // if (res.ok) {
    //   const json = await res.json();
    //   const data: Record<string, number>[] = json.audio_features;

    const avg: statsfm.AudioFeatures | {} = {};
    for (const audioFeature of data) {
      for (let i = 0; i < features.length; i++) {
        features[i].value += audioFeature[features[i].label];
      }
      for (let key in audioFeature) {
        if (typeof audioFeature[key] == 'number') {
          // @ts-ignore
          if (typeof avg[key] != 'number') {
            // @ts-ignore
            avg[key] = 0;
          }
          // @ts-ignore
          avg[key] += audioFeature[key];
        }
      }
    }

    for (let key in avg) {
      // @ts-ignore
      avg[key] = Math.round((avg[key] / data.length + Number.EPSILON) * 100) / 100;
      if (key == 'key') {
        // @ts-ignore
        avg[key] = Math.round(avg[key]);
      }
    }

    audioFeatures.value = avg as statsfm.AudioFeatures;

    for (let i = 0; i < features.length; i++) {
      features[i].value = features[i].value / features.length;
    }
    // }
  }

  return features;
};

const featuresWithPos: Ref<{ point: Point; feature: AudioFeature }[]> = ref([]);

onMounted(async () => {
  _features.value = await getAudioFeatures();
  emit('features', _features.value);
  drawRadarChart(_features.value);
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
