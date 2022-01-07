<template>
  <div
    class="w-full select-none cursor-pointer relative transform transition duration-200 hover:scale-105"
  >
    <Card class="flex flex-col items-center" :class="{ 'outline outline-primary': isSelected }">
      <MostChosenBadge v-if="plan.isMostChosen" class="absolute top-0 -translate-y-1/2" />

      <h1>{{ plan.quantity }}x</h1>
      <p>{{ plan.name }}</p>
      <p class="text-primary my-[-3px] font-bold text-center">{{ plan.save }}</p>
    </Card>

    <Button class="w-full mt-2 text-xl" size="small"
      >{{ plan.price }}<small class="ml-1">excl vat & fees</small></Button
    >
  </div>
</template>

<script lang="ts" setup>
import { Plan } from '~/types';

import Card from '../layout/Card.vue';
import Button from '../base/Button.vue';
import MostChosenBadge from './MostChosenBadge.vue';

defineProps<{
  plan: Plan;
  isSelected?: boolean;
}>();
</script>
