<template>
  <canvas ref="canvas" />
</template>

<script lang="ts" setup>
import dayjs from '~/dayjs';
import { onMounted, Ref, ref } from 'vue';
import { BacktrackAudioAnalysis, Point } from '~/types';

const props = defineProps<{
  analysis: BacktrackAudioAnalysis;
}>();

const canvas: Ref<HTMLCanvasElement | undefined> = ref();

const segments = props.analysis.segments;

onMounted(() => {
  const ctx = canvas.value?.getContext('2d');

  if (canvas.value && ctx) {
    const width = (canvas.value.width = 400);
    const height = (canvas.value.height = 400);
    const centrum: Point = { x: width / 2, y: height / 2 };

    let maxLoudness = -Infinity;
    let minLoudness = Infinity;
    let maxStart = 0;

    for (const segment of segments) {
      maxLoudness = Math.max(maxLoudness, segment.loudness_max);
      minLoudness = Math.min(minLoudness, segment.loudness_max);
      maxStart = Math.max(maxStart, segment.start);
    }

    const duration = maxStart;
    const radPerSec = (Math.PI * 2) / duration;

    // TODO: get these values from the global styles
    ctx.strokeStyle = 'rgb(30, 215, 96)';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(30, 215, 96, 0.2)';

    let isFirst = true;
    ctx.beginPath();
    for (const segment of segments) {
      const angle = Math.PI / 2 - segment.start * radPerSec;
      const radius =
        ((segment.loudness_max - minLoudness) / (maxLoudness - minLoudness)) * (width / 2) - 50;

      const x = centrum.x + radius * Math.cos(angle);
      const y = centrum.y + -radius * Math.sin(angle);

      if (isFirst) {
        isFirst = false;
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
    ctx.closePath();
    ctx.fill();

    drawTimeStamps(ctx, duration);
  }
});

const drawTimeStamps = (ctx: CanvasRenderingContext2D, totalDuration: number) => {
  if (canvas.value) {
    const centrum: Point = { x: canvas.value.width / 2, y: canvas.value.height / 2 };

    const durationPartsCount = 9;
    const durationPerPart = totalDuration / durationPartsCount;
    const anglePerPart = (Math.PI * 2) / durationPartsCount;

    let currentAngle = -anglePerPart;
    for (let i = 0; i < durationPartsCount; i++) {
      const partDuration = durationPerPart * i;
      const radius = canvas.value.width / 2 - 25;
      const pos: Point = {
        x: centrum.x + radius * Math.cos(currentAngle),
        y: centrum.x + radius * Math.sin(currentAngle)
      };

      ctx.textAlign = 'center';
      ctx.font = 'bold 16px Open Sans';
      ctx.fillStyle = 'white';
      ctx.fillText(dayjs.duration(partDuration, 'seconds').format('mm:ss'), pos.x, pos.y);

      currentAngle += anglePerPart;
    }
  }
};
</script>
