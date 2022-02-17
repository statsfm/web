<template>
  <div class="-mb-5">
    <span>{{ label }}</span>
    <h2 class="tracking-tight">
      {{ formatCount(count) }}

      <span v-if="hasLiveIndicator" class="relative aspect-square w-3">
        <span
          class="duration-1000s absolute aspect-square h-4 animate-ping rounded-full bg-primary/75"
        >
        </span>
        <span
          class="absolute mt-0.5 ml-0.5 aspect-square w-3 rounded-full bg-primary opacity-80"
        ></span>
      </span>
    </h2>
    <!-- <p class="inline-flex text-sm mt-0 ml-[-5px]" v-if="hasIndicator">
      <Icon
        class="mt-[-1px] mr-[4px] scale-90 h-[1.3rem] w-[1rem]" -->
    <p class="mt-0 ml-[-12px] inline-flex scale-90 text-neutral-500" v-if="hasIndicator">
      <Icon
        class="mr-[-1px] ml-[-2x] mt-[-1px] text-inherit"
        :path="
          diffBetweenCurrentAndPreviousSnapshot == 0
            ? mdiArrowRightThin
            : diffBetweenCurrentAndPreviousSnapshot > 0
            ? mdiArrowUpThin
            : mdiArrowDownThin
        "
      />
      <span class="mr-1 font-bold text-inherit">{{ formatCount(indicator) }}</span>
      in the last hour
    </p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { mdiArrowUpThin, mdiArrowDownThin, mdiArrowRightThin } from '@mdi/js';
import Icon from '../Icon.vue';

const props = defineProps<{
  hasLiveIndicator?: boolean;
  label: string;
  snapshot: any;
  hasIndicator?: boolean;
}>();

// refresh interval in milliseconds
const timeUnit = 50;

const snapshot = reactive(props.snapshot);
const count = ref(snapshot.current.count);
const indicator = ref(0);

// difference between the 2 datasnapshots in milliseconds
const timeDiff =
  new Date(snapshot.current.date).getTime() - new Date(snapshot.previous.date).getTime();

// offset in timeunits since the last snapshot
const epochOffset = (Date.now() - new Date(snapshot.current.date).getTime()) / timeUnit;

// difference between current and previous snapshot
const diffBetweenCurrentAndPreviousSnapshot = snapshot.current.count - snapshot.previous.count;

// increase per timeunit
const diffPerUnit = diffBetweenCurrentAndPreviousSnapshot / (timeDiff / timeUnit);

// add the initial epoch offset to the value
count.value += epochOffset * diffPerUnit;
indicator.value = diffPerUnit * /*24 **/ ((60 * 60 * 1000) / timeUnit);

// How long you want the animation to take, in ms
const animationDuration = 3000;
// Calculate how long each ‘frame’ should last if we want to update the animation 60 times per second
const frameDuration = 1000 / 60;
// Use that to calculate how many frames we need to complete the animation
const totalFrames = Math.round(animationDuration / frameDuration);
// An ease-out function that slows the count as it progresses
const easeOutQuad = (x: number) => (x === 1 ? 1 : 1 - Math.pow(10, -10 * x));
//  (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -20 * x));
//  (x < 0.95 ? x : x * (2 - x));
// Math.sqrt(1 - Math.pow(x - 1, 2));
// (x: number) => x * (2 - x);
// (x === 0 ? 0 : Math.pow(2, 10 * x - 10));

// The animation function, which takes an Element
const animateCountUp = () => {
  let frame = 0;
  const countTo = count.value + epochOffset * diffPerUnit;

  // Start the animation running 60 times per second
  const counter = setInterval(() => {
    frame++;
    // Calculate our progress as a value between 0 and 1
    // Pass that value to our easing function to get our
    // progress on a curve
    const progress = easeOutQuad(frame / totalFrames);
    // Use the progress value to calculate the current count
    const currentCount = Math.round(countTo * progress);

    // If the current count has changed, update the element
    if (count.value != countTo) {
      count.value = currentCount;
    }

    // If we’ve reached our last frame, stop the animation
    if (frame === totalFrames) {
      clearInterval(counter);
      startCounting();
    }
  }, frameDuration);
};

let interval: NodeJS.Timer;
const startCounting = () => {
  // every timeunit update the value
  interval = setInterval(() => {
    count.value += diffPerUnit;
  }, timeUnit);
};

onMounted(() => {
  animateCountUp();
});

onUnmounted(() => {
  // clear the interval on unmounted lifecycle hook
  clearInterval(interval);
});

const formatCount = (count: number): string => {
  return Math.round(count).toLocaleString('en-US');
};
</script>
