<template>
  <Header />
  <Container>
    <Heading>home</Heading>
  </Container>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { defineComponent } from "vue";
import Heading from "~/components/base/Heading.vue";

export default defineComponent({
  components: {
    Heading,
  },
  setup() {},
});
</script>
