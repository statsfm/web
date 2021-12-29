<template>
  <div>
    <dt class="text-base font-bold text-textGrey">{{ label }}</dt>
    <dd class="text-3xl font-bold tracking-tight text-white">
      {{ formatCount(current.count) }}
      <span v-if="hasLiveIndicator" class="h-3 w-3">
        <span
          style="margin-left: -2px; margin-top: -2px; animation-duration: 1.5s"
          class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-primary opacity-75"
        >
        </span>
        <span class="absolute rounded-full h-3 w-3 bg-primary opacity-80"></span>
      </span>
      <div class="text-textGrey flex flex-row items-center" v-if="hasIndicator">
        <Icon
          :path="
            diffWithPreviousSnapshot == 0
              ? mdiArrowRightThin
              : diffWithPreviousSnapshot > 0
              ? mdiArrowUpThin
              : mdiArrowDownThin
          "
        />
        <span class="text-sm font-normal tracking-normal">
          {{ formatCount(diffWithPreviousSnapshot) }}
          {{ dayjs(snapshot.current.date).from(snapshot.previous.date) }}
        </span>
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
console.log(snapshot.current.date, snapshot.previous.date);
const current = ref(snapshot.current);

// difference between the 2 datasnapshots in milliseconds
const timeDiff =
  new Date(snapshot.current.date).getTime() - new Date(snapshot.previous.date).getTime();

const diffWithPreviousSnapshot = snapshot.current.count - snapshot.previous.count;

// offset in timeunits since the last snapshot
const epochOffset = (Date.now() - new Date(snapshot.current.date).getTime()) / timeUnit;

// increase per timeunit
const diffPerUnit = (snapshot.current.count - snapshot.previous.count) / (timeDiff / timeUnit);

// add the initial epoch offset to the value
current.value.count += epochOffset * diffPerUnit;

// every timeunit update the value
setInterval(() => (current.value.count += diffPerUnit), timeUnit);

const formatCount = (count: number): string => {
  return Math.round(count).toLocaleString('en-US');
};
</script>
