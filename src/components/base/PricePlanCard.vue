<template>
  <div
    class="w-full select-none cursor-pointer relative transform transition duration-200 hover:scale-105"
  >
    <Card class="flex flex-col items-center" :class="{ 'outline outline-primary': isSelected }">
      <MostChosenBadge v-if="plan.isMostChosen" class="absolute top-0 -translate-y-1/2" />

      <h1 class="text-5xl font-bold">{{ plan.quantity }}x</h1>
      <p class="font-bold text-textGrey">{{ plan.name }}</p>
    </Card>
    <Divider></Divider>
    <Button class="w-full mt-2 text-lg" size="small"
      >{{ plan.price }} <small>incl vat & fees</small></Button
    >
  </div>
</template>

<script lang="ts" setup>
import { Plan } from '~/types';

import Card from '../layout/Card.vue';
import Button from '../base/Button.vue';
import MostChosenBadge from './MostChosenBadge.vue';

const props = defineProps<{
  plan: Plan;
  isSelected?: boolean;
}>();
</script>
