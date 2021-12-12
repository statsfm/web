<template>
  <Header />
  <Loading v-if="loading" />
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
        <Button @click="initCheckout(1)"> buy 1 giftcode </Button>
        <Button @click="initCheckout(3)"> buy 3 giftcodes </Button>
        <Button @click="initCheckout(5)"> buy 5 giftcodes </Button>
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
          <Text v-if="!giftCodes">loading...</Text>
          <Text v-if="giftCodes?.length == 0">no codes found</Text>
          <h3 v-for="code in giftCodes" :key="code.id">
            <pre>{{ formatCode(code.code) }}</pre>
          </h3>
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
import { defineComponent, ref, onMounted, Ref, onBeforeMount } from "vue";
import { useStore } from "~/store";

import Container from "~/components/layout/Container.vue";
import Header from "~/components/layout/Header.vue";
import Card from "~/components/layout/Card.vue";
import Heading from "~/components/base/Heading.vue";
import Divider from "~/components/base/Divider.vue";
import Loading from "~/components/base/Loading.vue";
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
    Loading,
    Text,
    Button,
  },
  setup() {
    const auth = useAuth();
    const giftCodes = ref(null);
    const loading = ref(false);

    onBeforeMount(() => {
      listGiftCodes();
    });

    const listGiftCodes = async () => {
      giftCodes.value = await api
        .get("/plus/giftcodes/list")
        .then((res) => res.data.items);
      loading.value = false;
    };

    const initCheckout = async (quantity: number) => {
      loading.value = true;
      const session = await api
        .get(`/plus/giftcodes/purchase?quantity=${quantity}`)
        .then((res) => res.data.item);

      location.href = session.url;
    };

    return {
      auth,
      loading,
      giftCodes,
      initCheckout,
    };
  },
  methods: {
    formatCode(code: string) {
      return code.match(new RegExp(".{1,4}", "g"))!.join("-");
    },
  },
});
</script>
