<template>
  <canvas ref="canvas" @mousemove="onMouseMove" />
</template>

<script lang="ts" setup>
import dayjs from '~/dayjs';
import { onMounted, Ref, ref } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import { Point } from '~/types';

const props = defineProps<{
  analysis: statsfm.AudioAnalysis;
}>();

const emit = defineEmits(['segment']);

const canvas: Ref<HTMLCanvasElement | undefined> = ref();
const segments = props.analysis.segments;

onMounted(() => {
  const ctx = canvas.value?.getContext('2d');

  if (canvas.value && ctx) {
    const width = (canvas.value.width = 400);
    const height = (canvas.value.height = 400);
    canvas.value.style.width = `${width}px`;
    canvas.value.style.height = `${height}px`;

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

      const segmentPos: Point = {
        x: centrum.x + radius * Math.cos(angle),
        y: centrum.y + -radius * Math.sin(angle)
      };

      if (isFirst) {
        isFirst = false;
        ctx.moveTo(segmentPos.x, segmentPos.y);
      } else {
        ctx.lineTo(segmentPos.x, segmentPos.y);
        ctx.stroke();
      }
    }
    ctx.closePath();
    ctx.fill();

    drawTimeStamps(ctx, duration);
  }
});

const timestamps: Ref<
  { point: Point; duration: number; formattedDuration: string; index: number }[]
> = ref([]);
const blockSegments: statsfm.AudioAnalysisSegment[] = [];

const drawTimeStamps = (ctx: CanvasRenderingContext2D, totalDuration: number) => {
  if (canvas.value) {
    const centrum: Point = { x: canvas.value.width / 2, y: canvas.value.height / 2 };

    const durationPartsCount = 9;
    const durationPerPart = (totalDuration + 1) / durationPartsCount;

    for (const segment of segments) {
      if (segment.start >= blockSegments.length * durationPerPart) {
        blockSegments.push(segment);
      }
    }

    const anglePerPart = (Math.PI * 2) / durationPartsCount;

    let currentAngle = -Math.PI / 2;
    for (let i = 0; i < blockSegments.length; i++) {
      const partDuration = blockSegments[i].start;
      const formattedDuration = dayjs.duration(partDuration, 'seconds').format('mm:ss');
      const radius = canvas.value.width / 2 - 25;

      const timeStampPos: Point = {
        x: centrum.x + radius * Math.cos(currentAngle),
        y: centrum.x + radius * Math.sin(currentAngle)
      };

      timestamps.value.push({
        point: timeStampPos,
        duration: partDuration,
        formattedDuration,
        index: i
      });

      ctx.textAlign = 'center';
      ctx.font = 'bold 16px Open Sans';
      ctx.fillStyle = 'white';
      ctx.fillText(formattedDuration, timeStampPos.x, timeStampPos.y);

      currentAngle += anglePerPart;
    }
  }
};

const onMouseMove = (e: MouseEvent) => {
  const ctx = canvas.value?.getContext('2d');

  if (canvas.value && ctx) {
    const mousePos = getMousePos(canvas.value, e);

    for (const timestamp of timestamps.value) {
      const bounding = ctx.measureText(timestamp.formattedDuration);
      const textHeight = bounding.actualBoundingBoxAscent + bounding.actualBoundingBoxDescent;
      const textWidth = bounding.width;

      if (
        mousePos.x > timestamp.point.x - textWidth / 2 &&
        mousePos.x < timestamp.point.x - textWidth / 2 + textWidth
      ) {
        if (
          mousePos.y > timestamp.point.y - textHeight &&
          mousePos.y < timestamp.point.y + textHeight
        ) {
          canvas.value.style.cursor = 'pointer';

          const segment = blockSegments[timestamp.index];
          const nextSegment = blockSegments[timestamp.index + 1];

          if (nextSegment) {
            emit('segment', { current: segment, next: nextSegment });
          } else {
            emit('segment', { current: segment, next: segments[segments.length - 1] });
          }

          return;
        }

        canvas.value.style.cursor = 'initial';
      }
    }
  }
};

const getMousePos = (canvas: HTMLCanvasElement, e: MouseEvent): Point => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};
</script>
