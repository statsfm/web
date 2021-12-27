<template>
  <div class="leading-3">
    <span class="text-textGrey font-bold">{{ label }}</span>
    <h4 class="text-2xl font-bold truncate">
      {{ formatCount(count) }}
    </h4>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { TotalSizeItem } from "~/types/totalStats";

const props = defineProps<{
  label: string;
  current: TotalSizeItem;
}>();

const item = reactive(props.current);
const count = ref(item.current.count);

setInterval(() => {
  count.value += Math.round(
    (item.current.count - item.previous.count) / 24 / 60 / 60 / 10
  );
}, 100);

const formatCount = (count: number): string => {
  return count.toLocaleString("en-US");
};
</script>
