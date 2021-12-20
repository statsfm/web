<template>
  <div
    class="
      w-full
      max-w-xl
      perspective
      cursor-pointer
      flex flex-col
      aspect-[5/3]
      mb-5
    "
    @click="flipped = !flipped"
  >
    <div
      class="flip relative transition-transform duration-1000"
      :class="{ flipped }"
    >
      <Card
        class="
          face
          flex
          justify-center
          items-center
          absolute
          aspect-[5/3]
          bg-[url('/giftcard_pattern.svg')]
          bg-contain
        "
      >
      </Card>
      <Card
        class="
          face
          back
          p-10
          select-none
          flex flex-col
          justify-center
          absolute
          aspect-[5/3]
        "
      >
        <p v-if="giftCode.message">{{ giftCode.message }}</p>
        <p v-else class="italic font-normal">{{ t("gift.no_message") }}</p>
        <span class="font-bold text-textGrey">{{ giftCode.boughtBy }}</span>
      </Card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.perspective {
  perspective: 1000px;
}
.flip {
  transform-style: preserve-3d;

  .face {
    backface-visibility: hidden;
  }

  .back {
    transform: rotateY(180deg);
  }
}

.flipped {
  transform: rotateY(180deg);
}
</style>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { GiftCode } from "~/types";

import Card from "../layout/Card.vue";

export default defineComponent({
  components: {
    Card,
  },
  props: {
    giftCode: {
      type: Object as PropType<GiftCode>,
      required: true,
    },
    isFlipped: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const flipped = ref(false);

    watch(
      () => props.isFlipped,
      (newVal) => {
        flipped.value = newVal;
      }
    );

    return { t, flipped };
  },
});
</script>
