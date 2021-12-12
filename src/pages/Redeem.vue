<template>
  <Header />
  <Loading v-if="loading" />
  <Container>
    <Heading :size="1">Redeem a Plus coupon</Heading>
    <br />
    <input
      class="code-input"
      type="text"
      name="code"
      pattern="[A-Z,a-z,0-9]{12}"
      maxlength="12"
      v-model="code"
    />
    <PinInput />
    <br />
    <br />
    <Text v-if="message">{{ message }}</Text>
    <br />
    <Button :disabled="code.length != 12" @click="submitCode">Redeem</Button>
  </Container>
</template>

<style lang="scss" scoped>
.code-input {
  border: none;
  background-color: var(--color-body-secundary);
  color: var(--color-text-primary);
  font-size: 2.1rem;
  letter-spacing: 5px;
  text-transform: uppercase;
  font-family: "Open Sans Bold", sans-serif;
  font-weight: 600;
  border-radius: 12px;
  padding: 8px 16px;
}
</style>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  Ref,
  onBeforeMount,
  watch,
  computed,
} from "vue";
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
    const loading = ref(false);
    const code = ref("");
    const message = ref("");
    // const formattedCode = computed({
    //   get: () => {
    //     if (code.value.length == 0) return "";
    //     return code.value
    //       .split("-")
    //       .join("")
    //       .match(new RegExp(".{1,4}", "g"))!
    //       .join("-");
    //   },
    //   set: (val) => {
    //     code.value = val;
    //   },
    // });

    onBeforeMount(() => {});

    const submitCode = async () => {
      loading.value = true;
      const res = await api.post(`/plus/giftcodes/${code.value}/redeem`);

      if (res.success) {
        message.value = JSON.stringify(res.data);
      } else {
        message.value = res.data.message;
      }

      loading.value = false;
    };

    return {
      auth,
      loading,
      code,
      message,
      submitCode,
      //   formattedCode,
    };
  },
});
</script>
