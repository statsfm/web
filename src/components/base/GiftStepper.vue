<template>
  <div class="w-full flex flex-col justify-between">
    <StepperSteps
      :steps="[
        { name: 'Select your plan' },
        { name: 'Personalize' },
        { name: 'Checkout' },
      ]"
      @step="currentStep = $event"
    />

    <div v-if="currentStep == 0">
      <div class="flex gap-3 justify-center mb-5">
        <PricePlanCard
          :isSelected="selectedIndex == index"
          v-for="(plan, index) in plans"
          :key="index"
          :plan="plan"
          @click="
            selectedPlan = plan;
            selectedIndex = index;
          "
        ></PricePlanCard>
      </div>
      <Button @click="currentStep = 1">Continue</Button>
    </div>

    <div v-if="currentStep == 1">
      <h1 class="text-2xl font-bold">Personalize</h1>
      <p class="font-bold text-textGrey mb-5">
        You can personalize your gift by adding a message.
      </p>

      <Textarea
        class="mb-5"
        placeholder="Enter a message"
        :isResizeable="false"
        :value="message"
        @input="message = $event"
      />
      <Button @click="currentStep = 2">Continue</Button>
    </div>

    <div v-if="currentStep == 2">
      <h1 class="text-2xl font-bold">Checkout</h1>
      <p class="font-bold text-textGrey mb-5">Check your details.</p>

      <Card class="flex flex-col w-full mb-5" v-if="selectedPlan.id">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="text-textGrey font-bold">Plan</span>
            <span>{{ selectedPlan.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-textGrey font-bold">Price</span>
            <span
              >{{ priceToString(selectedPlan?.price) }}
              <span class="text-textGrey">(incl vat/fees)</span></span
            >
          </div>
          <div class="flex justify-between gap-10">
            <span class="text-textGrey font-bold">Message</span>
            <span class="truncate">{{ message }}</span>
          </div>
        </div>
      </Card>
      <Card v-else class="mb-5">
        <p>You need to select a plan first</p>
      </Card>
      <Button @click="initCheckout(selectedPlan.quantity)">Checkout</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

import StepperStep from "./Stepper/StepperStep.vue";
import StepperSteps from "./Stepper/StepperSteps.vue";
import PricePlanCard from "./PricePlanCard.vue";
import Textarea from "./Textarea.vue";
import Button from "./Button.vue";
import Card from "~/components/layout/Card.vue";
import { Plan, Price } from "~/types";
import api from "~/api";

export default defineComponent({
  components: {
    StepperStep,
    StepperSteps,
    PricePlanCard,
    Textarea,
    Button,
    Card,
  },
  setup() {
    const message = ref("");
    const plans: Ref<Plan[]> = ref([]);

    const selectedPlan: Ref<Plan> = ref({} as Plan);
    const selectedIndex = ref();
    const currentStep = ref(0);

    const getPlans = async () => {
      const plans = await fetch("/plans.json");
      return plans.json();
    };

    const priceToString = (price: Price): string => {
      const amount = price.amount / 100;
      return amount.toLocaleString(navigator.language, {
        style: "currency",
        currency: price.currency,
      });
    };

    const initCheckout = async (quantity: number) => {
      const session = await api
        .get(`/plus/giftcodes/purchase?quantity=${quantity}`)
        .then((res) => res.data.item);

      location.href = session.url;
    };

    onMounted(async () => {
      plans.value = await getPlans();
    });

    return {
      currentStep,
      plans,
      selectedPlan,
      selectedIndex,
      priceToString,
      initCheckout,
      message,
    };
  },
});
</script>
