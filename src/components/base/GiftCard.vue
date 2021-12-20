<template>
  <div
    v-if="giftCodeData"
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
      class="flip relative transition-transform duration-700"
      :class="{ flipped: flipped }"
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
        class="face back flex justify-center items-center absolute aspect-[5/3]"
      >
        <p>{{ giftCodeData.message }}</p>
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
import { defineComponent, onMounted, Ref, ref } from "vue";
import api from "~/api";
import { GiftCode } from "~/types";

import Card from "../layout/Card.vue";

export default defineComponent({
  components: {
    Card,
  },
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const flipped = ref(false);
    const giftCodeData: Ref<GiftCode | null> = ref(null);

    const getGiftCode = async () => {
      const res = await api.get(
        `/plus/giftcodes/${props.code.split("-").join("")}`
      );

      if (res.success) {
        giftCodeData.value = res.data.item;
      }
    };

    onMounted(() => {
      getGiftCode();
    });

    return { flipped, giftCodeData };
  },
});
</script>
