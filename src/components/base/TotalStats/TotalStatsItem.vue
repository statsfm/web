<template>
  <div>
    <dt class="text-base font-bold text-textGrey">{{ label }}</dt>
    <dd class="text-3xl font-bold tracking-tight text-white">
      {{ formatCount(count) }}
      <span v-if="hasLiveIndicator" class="h-3 w-3">
        <span
          style="margin-left: -2px; margin-top: -2px; animation-duration: 1s"
          class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-primary opacity-75"
        >
        </span>
        <span class="absolute rounded-full h-3 w-3 bg-primary opacity-80"></span>
      </span>
      <div class="text-textGrey flex flex-row items-center" v-if="hasIndicator">
        <Icon
          :path="
            diffBetweenCurrentAndPreviousSnapshot == 0
              ? mdiArrowRightThin
              : diffBetweenCurrentAndPreviousSnapshot > 0
              ? mdiArrowUpThin
              : mdiArrowDownThin
          "
        />
        <p class="text-sm font-medium tracking-normal">
          <span class="font-bold">{{ formatCount(indicator) }}</span>
          {{ dayjs(snapshot.current.date).from(snapshot.previous.date) }}
        </p>
      </div>
    </dd>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
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

// every timeunit update the value
setInterval(() => {
  count.value += diffPerUnit;
  indicator.value = count.value - snapshot.previous.count;
}, timeUnit);

const formatCount = (count: number): string => {
  return Math.round(count).toLocaleString('en-US');
};
</script>
