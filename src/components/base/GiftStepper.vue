<template>
  <div class="w-full flex flex-col justify-between">
    <StepperSteps
      :steps="[
        { name: t('gift.select_plan') },
        { name: t('gift.personalize') },
        { name: t('gift.checkout') },
      ]"
      @step="currentStep = $event"
      :step="currentStep"
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
      <Button @click="currentStep = 1">{{ t("buttons.continue") }}</Button>
    </div>

    <div v-if="currentStep == 1">
      <h1 class="text-2xl font-bold">{{ t("gift.personalize") }}</h1>
      <p class="font-bold text-textGrey mb-5">
        {{ t("gift.personalize.description") }}
      </p>

      <Textarea
        class="mb-5"
        :placeholder="t('placeholders.enter_message')"
        :isResizeable="false"
        :value="message"
        :max="100"
        @input="message = $event"
      />
      <Button @click="currentStep = 2">{{ t("buttons.continue") }}</Button>
    </div>

    <div v-if="currentStep == 2">
      <h1 class="text-2xl font-bold">{{ t("gift.checkout") }}</h1>
      <p class="font-bold text-textGrey mb-5">
        {{ t("gift.checkout.description") }}
      </p>

      <Card class="flex flex-col w-full mb-5" v-if="selectedPlan.id">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between">
            <span class="text-textGrey font-bold">{{ t("gift.plan") }}</span>
            <span>{{ selectedPlan.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-textGrey font-bold">{{ t("gift.price") }}</span>
            <span
              >{{ priceToString(selectedPlan?.price) }}
              <span class="text-textGrey">(incl vat/fees)</span></span
            >
          </div>
          <div class="flex justify-between gap-10">
            <span class="text-textGrey font-bold">{{ t("gift.message") }}</span>
            <span class="truncate">{{ message }}</span>
          </div>
        </div>
      </Card>
      <Card v-else class="mb-5">
        <p>{{ t("gift.select_plan_first") }}</p>
      </Card>
      <Button @click="initCheckout(selectedPlan.quantity)">{{
        t("buttons.checkout")
      }}</Button>
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
import { useI18n } from "vue-i18n";

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
    const { t } = useI18n();
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
      t,
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
