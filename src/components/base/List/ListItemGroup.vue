<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { Keys } from '~/types';

interface Props {
  items: any[];
}

const props = defineProps<Props>();

const list: Ref<HTMLDivElement | undefined> = ref();
const focusedIndex = ref(0);

const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case Keys.ArrowUp:
      focusPrevious();
      break;
    case Keys.Tab:
    case Keys.ArrowDown:
      focusNext();
      break;
  }
};

const focusPrevious = () => {
  if (focusedIndex.value > 0) {
    focusedIndex.value--;
    focus(focusedIndex.value);
  }
};

const focusNext = () => {
  if (focusedIndex.value < props.items.length - 1) {
    focusedIndex.value++;
    focus(focusedIndex.value);
  }
};

onMounted(() => {
  // focus the first element on mounted
  focus(0);
});

const focus = (index: number) => {
  (list.value?.children[index] as HTMLElement).focus();
};
</script>

<template>
  <ul class="flex flex-col bg-bodySecundary" ref="list" @keydown.prevent="onKeyDown">
    <slot v-for="(item, index) in items" :item="item" :index="index" />
  </ul>
</template>
