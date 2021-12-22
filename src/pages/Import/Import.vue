<template>
  <Container>
    <Stepper :steps="steps" />
  </Container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Container from "~/components/layout/Container.vue";
import StepperSteps from "~/components/base/Stepper/StepperSteps.vue";
import Stepper from "~/components/base/Stepper/Stepper.vue";

import ImportStep from "./ImportStep.vue";
import SuccessStep from "./SuccessStep.vue";
import AuthenticateStep from "./AuthenticationStep.vue";

import { Step } from "~/types";

export default defineComponent({
  components: {
    Container,
    StepperSteps,
    Stepper,
  },
  setup() {
    const steps: Step[] = [
      {
        name: "Authenticate",
        description: "Please enter your import code to continue",
        component: AuthenticateStep,
        disabled: true,
      },
      {
        name: "Import",
        description: "Select the endsong_*.json file you want to import",
        component: ImportStep,
        disabled: true,
      },
      {
        name: "Success",
        component: SuccessStep,
        disabled: true,
      },
    ];

    return { steps };
  },
});
</script>
