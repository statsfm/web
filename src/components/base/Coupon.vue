<template>
  <Card>
    <Text class="mb-3"
      >Purchased {{ dayjs(giftcode.purchaseDate).fromNow() }}</Text
    >
    <Badge @click="copyRedeemCode" class="cursor-copy w-full">{{
      formatCode(giftcode.code)
    }}</Badge>
  </Card>
</template>

<style lang="scss" scoped>
.coupon {
  padding: var(--space-s);

  .code {
    cursor: copy;
  }
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import Card from "~/components/layout/Card.vue";
import Text from "~/components/base/Text.vue";
import Badge from "~/components/base/Badge.vue";

import dayjs from "~/dayjs";
import { GiftCode } from "~/types";

export default defineComponent({
  components: {
    Card,
    Text,
    Badge,
  },
  props: {
    giftcode: {
      type: Object as PropType<GiftCode>,
      required: true,
    },
  },
  setup(props) {
    const formatCode = (code: string) => {
      return code.match(new RegExp(".{1,4}", "g"))!.join("-");
    };

    const copyRedeemCode = () => {
      navigator.clipboard.writeText(props.giftcode.code);
    };

    return { dayjs, formatCode, copyRedeemCode };
  },
});
</script>
