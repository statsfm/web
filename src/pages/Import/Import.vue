<template>
  <Header />
  <Container>
    <Stepper :steps="steps" />
  </Container>
</template>

<script lang="ts" setup>
import Header from "~/components/layout/Header.vue";
import Container from "~/components/layout/Container.vue";
import StepperSteps from "~/components/base/Stepper/StepperSteps.vue";
import Stepper from "~/components/base/Stepper/Stepper.vue";

import ImportStep from "./ImportStep.vue";
import SuccessStep from "./SuccessStep.vue";
import AuthenticateStep from "./AuthenticationStep.vue";

import { Step } from "~/types";

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
</script>
