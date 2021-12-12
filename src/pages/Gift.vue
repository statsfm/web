<template>
  <Header />
  <Container>
    <div class="cards">
      <Card>
        <Heading :size="1">Gift Plus coupons</Heading>
        <Button v-if="user == null" size="small" @click="login"
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

    const user = ref(null);
    const redirectUri = ref("");
    const clientId = ref("10a0c86a444b4e7bad722e9d08da0be6");
    const apiToken = ref();

    onMounted(() => {
      redirectUri.value = location.origin;
      apiToken.value = localStorage.getItem("apiToken");

      const params = new URLSearchParams(location.search);
      if (params.has("code")) {
        const code = params.get("code");

        if (code && code.length > 100) {
          exchangeToken(code);
        }
      }

      if (apiToken.value) {
        const expired = isTokenExpired(apiToken.value);

        // if (!expired) {
        //   user.value =
        // }
      }
    });

    const login = () => {
      const loginUrl = `https://accounts.spotify.com/authorize?client_id=${
        clientId.value
      }&redirect_uri=${encodeURIComponent(
        redirectUri.value
      )}&scope=user-read-private&response_type=code&response_mode=query&state=${Date.now()}`;

      // location.replace(loginUrl);
      console.log(loginUrl);
    };

    const exchangeToken = async (code: string) => {
      const res = await api.post("/auth/token", {
        body: JSON.stringify({
          code,
          client_id: clientId.value,
          redirect_uri: redirectUri.value,
        }),
        redirect: "follow",
      });

      const data = res.data.data;

      if (data.apiToken?.length > 10 && data.user) {
        apiToken.value = data.apiToken;
        store.commit("setUser", data.user);

        localStorage.setItem("apiToken", apiToken.value);
        location.search = "";
      }
    };

    const isTokenExpired = (token: string) => {
      // maybe turn this into computed with this.apiToken
      const expiry = JSON.parse(
        // Buffer.from(token.split(".")[1], "base64").toString() // since atob is deprecated
        atob(token.split(".")[1])
      ).exp;
      return Math.floor(new Date().getTime() / 1000) >= expiry;
    };

    return { user, login };
  },
});
</script>
