<template>
  <div>
    <dt class="text-base font-bold text-textGrey">{{ label }}</dt>
    <dd class="text-3xl font-bold tracking-tight text-white">
      {{ formatCount(current.count) }}
      <span v-if="ping" class="h-3 w-3">
        <span
          style="margin-left: -2px; margin-top: -2px; animation-duration: 1.5s"
          class="
            animate-ping
            absolute
            inline-flex
            h-4
            w-4
            rounded-full
            bg-primary
            opacity-75
          "
        >
        </span>
        <span
          class="absolute rounded-full h-3 w-3 bg-primary opacity-80"
        ></span>
      </span>
      <!-- <br />
      <div class="text-textGrey flex flex-row items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7l4-4m0 0l4 4m-4-4v18"
          ></path>
        </svg>
        <span class="text-sm font-normal tracking-normal">
          {{ formatCount(diff) }} in the last day
        </span>
      </div> -->
    </dd>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { TotalSizeItem } from "~/types/totalStats";

const props = defineProps<{
  ping: boolean;
  label: string;
  item: TotalSizeItem;
}>();

const item = reactive(props.item);
const current = ref(item.current);
const refreshInterval = 50;

const timeDiff =
  new Date(item.current.date).getTime() -
  new Date(item.previous.date).getTime();

const diffPerInterval =
  (item.current.count - item.previous.count) / (timeDiff / refreshInterval);

setInterval(() => (current.value.count += diffPerInterval), refreshInterval);

const formatCount = (count: number): string => {
  return Math.round(count).toLocaleString("en-US");
};
</script>
