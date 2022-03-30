<script lang="ts" setup>
import { mdiImageOff } from '@mdi/js';
import { useAttrs } from 'vue';
import Icon from '~/components/base/Icon.vue';

type Variant = 'square' | 'round';

interface Props {
  src?: string;
  alt?: string;
  variant: Variant;
}

const variantMap: Record<Variant, string> = {
  square: 'rounded-lg',
  round: 'rounded-full'
};

withDefaults(defineProps<Props>(), {
  variant: 'square'
});

const attrs = useAttrs();
</script>

<template>
  <Transition
    enter-active-class="transition ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-active-class="transition ease-in"
    leave-from-class="transform opacity-100"
    leave-to-class="transform opacity-0"
    mode="out-in"
  >
    <img
      v-if="src"
      :src="src"
      :key="src"
      :alt="alt"
      v-bind="attrs"
      class="grid place-items-center bg-bodySecundary object-cover object-center text-neutral-400"
      :class="variantMap[variant]"
    />
    <div
      v-else
      :alt="alt"
      v-bind="attrs"
      class="grid place-items-center bg-bodySecundary object-cover object-center text-neutral-400"
      :class="variantMap[variant]"
    >
      <Icon :path="mdiImageOff" class="scale-125 text-neutral-500" />
    </div>
  </Transition>
</template>
