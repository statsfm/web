<template>
  <div>
    <dt class="text-base font-bold text-textGrey">{{ label }}</dt>
    <dd class="text-3xl font-bold tracking-tight text-white">
      {{ formatCount(current.count) }}
      <span v-if="ping" class="h-3 w-3">
        <span
          style="margin-left: -2px; margin-top: -2px; animation-duration: 1.5s"
          class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-primary opacity-75"
        >
        </span>
        <span class="absolute rounded-full h-3 w-3 bg-primary opacity-80"></span>
      </span>
      <!-- <br />
      <div class="text-textGrey flex flex-row items-center">
        <Icon :path="mdiArrowUpThin" />
        <span class="text-sm font-normal tracking-normal">
          {{ formatCount(diff) }} in the last day
        </span>
      </div> -->
    </dd>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { TotalSizeItem } from '~/types/totalStats';

import { mdiArrowUpThin } from '@mdi/js';
import Icon from '../Icon.vue';

const props = defineProps<{
  ping: boolean;
  label: string;
  item: TotalSizeItem;
}>();

// refresh interval in milliseconds
const timeUnit = 50;

const item = reactive(props.item);
const current = ref(item.current);

// difference between the 2 datasnapshots in milliseconds
const timeDiff = new Date(item.current.date).getTime() - new Date(item.previous.date).getTime();

// offset in timeunits since the last snapshot
const epochOffset = (Date.now() - new Date(item.current.date).getTime()) / timeUnit;

// increase per timeunit
const diffPerUnit = (item.current.count - item.previous.count) / (timeDiff / timeUnit);

// add the initial epoch offset to the value
current.value.count += epochOffset * diffPerUnit;

// every timeunit update the value
setInterval(() => (current.value.count += diffPerUnit), timeUnit);

const formatCount = (count: number): string => {
  return Math.round(count).toLocaleString('en-US');
};
</script>
