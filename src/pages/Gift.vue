<template>
  <Header />
  <Container>
    <div class="cards">
      <Card>
        <Heading :size="1">Gift Plus coupons</Heading>
        <Button
          v-if="!this.auth.isLoggedIn()"
          size="small"
          @click="this.auth.login"
          >Log in through Spotify</Button
        >
        <Divider />
        <span class="color-text-grey"
          >Supported payment methods • All terms and conditions • Refund
          policy</span
        >
      </Card>
      <div>
        <Card>
          <Heading :size="1">Holliday special 🎄</Heading>
          <Text
            >When purchasing a gift package, there's a 1% chance your package
            contents will be doubled</Text
          >
          <Heading :size="4" class="mt-s">Example</Heading>
          <Text
            >If you buy a package with 5 codes, and you're lucky, you'll receive
            10 codes instead of just 5</Text
          >
        </Card>
        <Card>
          <Heading :size="1">Your coupons</Heading>
        </Card>
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.cards {
  display: flex;
  gap: var(--space-s);

  > div {
    display: flex;
    flex-direction: column;
    gap: var(--space-s);
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "~/store";

import Container from "~/components/layout/Container.vue";
import Header from "~/components/layout/Header.vue";
import Card from "~/components/layout/Card.vue";
import Heading from "~/components/base/Heading.vue";
import Divider from "~/components/base/Divider.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import api from "~/api";
import { useAuth } from "~/hooks/auth";

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
    const auth = useAuth();

    return { auth };
  },
});
</script>
