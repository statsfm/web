<template>
  <LoadingOverlay v-if="isLoading" />
  <Container class="flex flex-col items-center">
    <GiftCard v-if="giftCode" :giftCode="giftCode" :isFlipped="isFlipped" />
    <Button class="max-w-xl" @click="redeemGiftCode">{{
      t("buttons.redeem")
    }}</Button>
  </Container>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from "vue";

import Container from "~/components/layout/Container.vue";
import GiftCard from "~/components/base/GiftCard.vue";
import { GiftCode } from "~/types";
import api from "~/api";
import { useRoute } from "vue-router";
import Button from "~/components/base/Button.vue";
import { useI18n } from "vue-i18n";
import { useStore } from "~/store";
import LoadingOverlay from "~/components/base/LoadingOverlay.vue";

export default defineComponent({
  components: {
    Container,
    GiftCard,
    Button,
    LoadingOverlay,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();

    const giftCode: Ref<GiftCode | null> = ref(null);
    const code = ref("");
    const isLoading = ref(false);
    const isFlipped = ref(false);

    const getGiftCode = async (code: string) => {
      isLoading.value = true;
      const res = await api.get(`/plus/giftcodes/${code}`);

      if (res.success) {
        giftCode.value = res.data.item;
      } else {
        store.commit("setError", { message: res.data.message, type: "error" });
      }

      isLoading.value = false;
    };

    const redeemGiftCode = async () => {
      const res = await api.post(`/plus/giftcodes/${code.value}/redeem`);

      if (res.success) {
        store.commit("setError", {
          message: t("errors.successfully_redeemed"),
          type: "info",
        });

        isFlipped.value = true;
      } else {
        store.commit("setError", {
          message: res.data.message,
          type: "error",
        });
      }
    };

    onMounted(() => {
      code.value = route.params.code.toString();
      getGiftCode(code.value);
    });

    return { t, giftCode, isLoading, isFlipped, redeemGiftCode };
  },
});
</script>
