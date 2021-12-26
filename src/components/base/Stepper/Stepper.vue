<template>
  <StepperSteps
    :steps="mutatedSteps"
    @step="currentStep = $event"
    :step="currentStep"
  />

  <div>
    <div v-if="steps[currentStep].description" class="mb-2">
      <h1 class="font-bold text-2xl">{{ steps[currentStep].name }}</h1>
      <p class="font-bold text-textGrey">
        {{ steps[currentStep].description }}
      </p>
    </div>

    <component
      :is="steps[currentStep].component"
      @setDisabledState="setDisabledState"
    />

    <Button
      class="mt-5"
      v-if="currentStep + 1 < steps.length"
      @click="onContinue"
      :disabled="mutatedSteps[currentStep].disabled"
      >{{ t("buttons.continue") }}</Button
    >
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import { Step } from "~/types";

import StepperSteps from "./StepperSteps.vue";
import Button from "../Button.vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  steps: Step[];
  step?: number;
}>();

defineEmits(["continue"]);

const { t } = useI18n();

const currentStep: Ref<number> = ref(0);
const mutatedSteps: Ref<Step[]> = ref(props.steps);

watch(
  () => props.step,
  (newVal) => {
    currentStep.value = newVal as number;
  }
);

const setDisabledState = (state: boolean) => {
  mutatedSteps.value[currentStep.value].disabled = state;

  // TODO: improve
  // set next step disabled state
  if (mutatedSteps.value[currentStep.value + 1]) {
    mutatedSteps.value[currentStep.value + 1].disabled = state;
  }
};

const onContinue = () => {
  currentStep.value = currentStep.value + 1;
};
</script>
