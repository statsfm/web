<template>
  <Header />
  <Container>
    <Heading :size="1">home</Heading>
  </Container>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "~/store";
import { useAuth } from "~/hooks/auth";

import Container from "~/components/layout/Container.vue";
import Header from "~/components/layout/Header.vue";
import Card from "~/components/layout/Card.vue";
import Heading from "~/components/base/Heading.vue";
import Divider from "~/components/base/Divider.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import api from "~/api";

export default defineComponent({
  components: {
    Container,
    Header,
    Card,
    Heading,
    Divider,
    Text,
    Button,
  },
  setup() {
    const store = useStore();
    const auth = useAuth();
  },
});
</script>
