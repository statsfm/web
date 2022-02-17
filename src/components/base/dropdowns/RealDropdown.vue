<template>
  <div v-click-away="hide">
    <div @click="toggle" ref="handler">
      <slot name="button" :active="isActive" />
    </div>

    <!-- TODO: add fade out animtion -->
    <Teleport to="body">
      <div
        ref="dropdown"
        :aria-hidden="isActive"
        class="absolute right-0 z-20 max-h-96 w-max animate-fadeIn overflow-y-auto shadow-xl"
        v-show="isActive"
        @click="hide"
        @keydown="onKeyDown"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue';
import { createPopper } from '@popperjs/core';
import { Keys } from '~/types';

type Alignment = 'start' | 'end';
type BasePlacement = 'top' | 'right' | 'bottom' | 'left';
type AlignedPlacement = `${BasePlacement}-${Alignment}`;
type Placement = BasePlacement | AlignedPlacement;

interface Props {
  placement?: Placement;
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-end'
});

const isActive = ref(false);

const handler: Ref<HTMLDivElement | undefined> = ref();
const dropdown: Ref<HTMLDivElement | undefined> = ref();

const toggle = () => {
  isActive.value = !isActive.value;
};

const hide = () => {
  isActive.value = false;
};

const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case Keys.Enter:
    case Keys.Escape:
      hide();
  }
};

onMounted(() => {
  if (dropdown.value && handler.value) {
    createPopper(handler.value, dropdown.value, {
      placement: props.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8]
          }
        }
      ]
    });
  }
});
</script>
