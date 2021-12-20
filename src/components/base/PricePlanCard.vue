<template>
  <div
    class="
      w-full
      select-none
      cursor-pointer
      relative
      transform
      transition
      duration-200
      hover:scale-105
    "
  >
    <Card
      class="flex flex-col items-center"
      :class="{ 'outline outline-primary': isSelected }"
    >
      <MostChosenBadge
        v-if="plan.isMostChosen"
        class="absolute top-0 -translate-y-1/2"
      />

      <h1 class="text-5xl font-bold">{{ plan.quantity }}x</h1>
      <p class="font-bold text-textGrey">{{ plan.name }}</p>
    </Card>
    <Divider></Divider>
    <Button
      class="w-full mt-2 text-lg"
      size="small"
      @click="console.log('ddas')"
      >{{ plan.price }} <small>incl vat & fees</small></Button
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Plan } from "~/types";

import Card from "../layout/Card.vue";
import Button from "../base/Button.vue";
import MostChosenBadge from "./MostChosenBadge.vue";

export default defineComponent({
  components: {
    Card,
    Button,
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
  setup() {},
});
</script>
