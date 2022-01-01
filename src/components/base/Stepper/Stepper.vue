<template>
  <StepperSteps :steps="mutatedSteps" @step="currentStep = $event" :step="currentStep" />

  <div>
    <KeepAlive>
      <component :is="steps[currentStep].component" @setDisabledState="setDisabledState" />
    </KeepAlive>

    <Button
      class="mt-5"
      :class="{ 'cursor-default': mutatedSteps[currentStep].disabled }"
      v-if="currentStep + 1 < steps.length"
      @click="onContinue"
      :disabled="mutatedSteps[currentStep].disabled"
      >{{ t('buttons.continue') }}</Button
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive, Ref, ref, watch } from 'vue';
import { Step } from '~/types';

import StepperSteps from './StepperSteps.vue';
import Button from '../Button.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  steps: Step[];
  step?: number;
}>();

defineEmits(['continue']);

const { t } = useI18n();

const currentStep: Ref<number> = ref(0);
const mutatedSteps: Step[] = reactive(props.steps);

watch(
  () => props.step,
  (newVal) => {
    currentStep.value = newVal as number;
  }
);

const setDisabledState = (state: boolean) => {
  // set curent step disabled state
  mutatedSteps[currentStep.value].disabled = state;

  // set current step to completed
  mutatedSteps[currentStep.value].completed = true;

  // TODO: improve
  // set next step disabled state
  if (mutatedSteps[currentStep.value + 1]) {
    mutatedSteps[currentStep.value + 1].disabled = false;
  }
};

const onContinue = () => {
  currentStep.value = currentStep.value + 1;
};
</script>
