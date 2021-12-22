<template>
  <div class="flex justify-between mb-8">
    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
      <StepperStep
        :index="index + 1"
        @click="setCurrentStep(index)"
        :isCurrent="currentStep == index"
        :disabled="step.disabled"
        >{{ step.name }}
      </StepperStep>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { Step } from "~/types";
import StepperStep from "./StepperStep.vue";

export default defineComponent({
  props: {
    steps: {
      type: Array as PropType<Step[]>,
    },
    step: {
      type: Number,
      required: false,
    },
  },
  emits: ["step"],
  components: {
    StepperStep,
  },
  setup(props, { emit }) {
    const currentStep = ref(0);

    watch(
      () => props.step,
      (newVal) => {
        currentStep.value = newVal as number;
      }
    );

    const setCurrentStep = (index: number) => {
      currentStep.value = index;
      emit("step", index);
    };

    return { currentStep, setCurrentStep };
  },
});
</script>
