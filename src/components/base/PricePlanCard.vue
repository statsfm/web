<template>
  <div
    class="w-full select-none cursor-pointer relative transform transition duration-200 hover:scale-105"
  >
    <Card
      class="flex flex-col items-center text-center"
      :class="{ 'outline outline-primary': isSelected }"
    >
      <MostChosenBadge v-if="plan.isMostChosen" class="absolute top-0 -translate-y-1/2" />

      <h1>{{ plan.quantity }}x</h1>
      <p>{{ plan.name }}</p>
      <p
        class="text-primary my-[-3px] font-bold"
        v-if="calculateSavePercentage(plan, defaultPlan) > 0"
      >
        {{ t('gift.save_with_bundle', { percentage: calculateSavePercentage(plan, defaultPlan) }) }}
      </p>
    </Card>

    <Button class="w-full mt-2 text-xl" size="small"
      >{{ formatAmount(plan.price.amount) }}{{ plan.price.currency
      }}<small class="ml-1">excl vat & fees</small></Button
    >
  </div>
</template>

<script lang="ts" setup>
import { Plan } from '~/types';

import Card from '../layout/Card.vue';
import Button from '../base/Button.vue';
import MostChosenBadge from './MostChosenBadge.vue';
import { useI18n } from 'vue-i18n';

defineProps<{
  plan: Plan;
  defaultPlan: Plan;
  isSelected?: boolean;
}>();

const { t } = useI18n();

const calculateSavePercentage = (plan: Plan, defaultPlan: Plan): number => {
  const defaultAmount = defaultPlan.price.amount * plan.quantity;
  const planAmount = plan.price.amount;
  return Math.round(Math.abs(((planAmount - defaultAmount) / defaultAmount) * 100) * 10) / 10;
};

// TODO: fix this code
const formatAmount = (amount: number): number => {
  return amount / 100;
};
</script>
