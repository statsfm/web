<template>
  <Card
    class="
      flex flex-col
      justify-center
      items-center
      text-center
      select-none
      cursor-pointer
      relative
    "
    :class="{ 'outline outline-primary': isSelected }"
  >
    <MostChosenBadge
      v-if="plan.isMostChosen"
      class="absolute top-0 -translate-y-1/2"
    />

    <h1 class="text-5xl font-bold">{{ plan.quantity }}x</h1>
    <p class="font-bold text-textGrey mb-5">{{ plan.name }}</p>
    <span class="font-bold">{{ priceToString(plan.price) }}</span>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Plan, Price } from "~/types";

import Card from "../layout/Card.vue";
import MostChosenBadge from "./MostChosenBadge.vue";

export default defineComponent({
  components: {
    Card,
    MostChosenBadge,
  },
  props: {
    plan: {
      type: Object as PropType<Plan>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const priceToString = (price: Price): string => {
      const amount = price.amount / 100;
      return amount.toLocaleString(navigator.language, {
        style: "currency",
        currency: price.currency,
      });
    };

    return { priceToString };
  },
});
</script>
