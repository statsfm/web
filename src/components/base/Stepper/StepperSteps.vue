<template>
  <div class="mb-8 flex justify-between">
    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
      <StepperStep
        :index="index + 1"
        @click="setCurrentStep(index)"
        :isCurrent="currentStep == index"
        :isDisabled="step.disabled"
        :isCompleted="step.completed"
        >{{ step.name }}
      </StepperStep>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Step } from '~/types';
import StepperStep from './StepperStep.vue';

const props = defineProps<{
  steps: Step[];
  step?: number;
}>();

const emit = defineEmits(['step']);
const currentStep = ref(0);

watch(
  () => props.step,
  (newVal) => {
    currentStep.value = newVal as number;
  }
);

const setCurrentStep = (index: number) => {
  currentStep.value = index;
  emit('step', index);
};
</script>
