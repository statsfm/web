<template>
  <Loading v-if="loading" />
  <Container>
    <div v-if="!isRedeemPageActive">
      <h1 class="text-4xl font-bold mb-5">Redeem a Plus coupon</h1>

      <input
        placeholder="XXXX-XXXX-XXXX"
        @input="code = $event.target?.value"
        :value="code"
        class="bg-bodySecundary font-bold rounded-2xl p-5 mb-5"
      />

      <Button
        @click="isRedeemPageActive = true"
        :disabled="isContinueButtonDisabled"
        >{{ t("buttons.continue") }}</Button
      >
    </div>

    <div class="flex flex-col items-center">
      <GiftCard v-if="isRedeemPageActive" :code="code" />

      <Button>{{ t("buttons.redeem") }}</Button>
    </div>
  </Container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";

import Container from "~/components/layout/Container.vue";
import Header from "~/components/layout/Header.vue";
import Card from "~/components/layout/Card.vue";
import Heading from "~/components/base/Heading.vue";
import Divider from "~/components/base/Divider.vue";
import Loading from "~/components/base/Loading.vue";
import Text from "~/components/base/Text.vue";
import Button from "~/components/base/Button.vue";
import GiftCard from "~/components/base/GiftCard.vue";
import api from "~/api";
import { useStore } from "~/store";
import { useI18n } from "vue-i18n";

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
    GiftCard,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const loading = ref(false);

    const isRedeemPageActive = ref(false);
    const isContinueButtonDisabled = ref(true);
    const code = ref("");

    const segmentChars = 4;
    const segmentCount = 3;
    const totalCharLength = segmentChars * segmentCount + (segmentCount - 1);

    watch(code, (newCode, oldCode) => {
      if (newCode.length == totalCharLength) {
        isContinueButtonDisabled.value = false;
      }

      if (newCode.length > 0) {
        if (!newCode[newCode.length - 1].match(/^[a-z0-9]+$/i)) {
          newCode = newCode.slice(0, newCode.length - 1);
        }
      }

      if (newCode.length > 0) {
        if (newCode.length < totalCharLength) {
          isContinueButtonDisabled.value = true;
        }

        if (newCode.length % (segmentChars + 1) == 0) {
          if (newCode.length >= oldCode.length) {
            newCode =
              newCode.slice(0, newCode.length - 1) +
              "-" +
              newCode[newCode.length - 1];
          } else {
            newCode = newCode.slice(0, newCode.length - 1);
          }
        }
      }

      code.value = newCode.toUpperCase().substring(0, totalCharLength);
    });

    const submitCode = async () => {
      loading.value = true;
      const res = await api.post(
        `/plus/giftcodes/${code.value.split("-").join("")}/redeem`
      );

      if (res.success) {
        store.commit("setError", { message: res.data.message, type: "info" });
      } else {
        store.commit("setError", { message: res.data.message, type: "error" });
      }

      loading.value = false;
    };

    return {
      t,
      loading,
      isRedeemPageActive,
      isContinueButtonDisabled,
      code,
      submitCode,
    };
  },
});
</script>
