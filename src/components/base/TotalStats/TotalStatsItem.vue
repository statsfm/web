<template>
  <div>
    <span>{{ label }}</span>
    <h2 class="tracking-tight">
      {{ formatCount(count) }}

      <span v-if="hasLiveIndicator" class="w-3 aspect-square relative">
        <span
          class="absolute animate-ping duration-1000s h-4 aspect-square rounded-full bg-primary/75"
        >
        </span>
        <span
          class="absolute mt-0.5 ml-0.5 rounded-full w-3 aspect-square bg-primary opacity-80"
        ></span>
      </span>
    </h2>

    <p class="inline-flex mt-0 ml-[-5px]" v-if="hasIndicator">
      <Icon
        :path="
          diffBetweenCurrentAndPreviousSnapshot == 0
            ? mdiArrowRightThin
            : diffBetweenCurrentAndPreviousSnapshot > 0
            ? mdiArrowUpThin
            : mdiArrowDownThin
        "
      />
      <span class="font-bold mr-1">{{ formatCount(indicator) }}</span>
      {{ dayjs(snapshot.current.date).from(snapshot.previous.date) }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { TotalSizeItem } from '~/types/totalStats';

import { mdiArrowUpThin, mdiArrowDownThin, mdiArrowRightThin } from '@mdi/js';
import Icon from '../Icon.vue';

import dayjs from '~/dayjs';

const props = defineProps<{
  hasLiveIndicator?: boolean;
  label: string;
  snapshot: TotalSizeItem;
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

let interval: NodeJS.Timer;
onMounted(() => {
  // every timeunit update the value
  interval = setInterval(() => {
    count.value += diffPerUnit;
    indicator.value = count.value - snapshot.previous.count;
  }, timeUnit);
});

onUnmounted(() => {
  // clear the interval on unmounted lifecycle hook
  clearInterval(interval);
});

const formatCount = (count: number): string => {
  return Math.round(count).toLocaleString('en-US');
};
</script>
