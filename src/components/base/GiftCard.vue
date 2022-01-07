<template>
  <div
    class="w-full max-w-xl perspective cursor-pointer flex flex-col aspect-[5/3] mb-5"
    @click="onGiftCardClick"
  >
    <div class="flip relative transition-transform duration-1000" :class="{ flipped }">
      <Card
        class="face flex justify-center items-center absolute aspect-[5/3] bg-[url('/giftcard_pattern.svg')] bg-contain"
      >
      </Card>
      <Card
        v-if="giftCode"
        class="face back p-10 select-none flex flex-col justify-center absolute aspect-[5/3]"
      >
        <p v-if="giftCode.message" class="text-xl text-white">{{ giftCode.message }}</p>
        <p v-else class="italic font-normal text-xl text-white">
          {{ t('gift.no_message') }}
        </p>
        <span>
          <i18n-t keypath="gift.gifted_by">
            <template v-slot:name>
              <Link
                :to="{ name: 'User', params: { id: giftCode.boughtBy } }"
                class="font-extrabold"
                >{{ giftCode.boughtBy }}</Link
              >
            </template>
          </i18n-t>
        </span>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.perspective {
  perspective: 1000px;
}
.flip {
  transform-style: preserve-3d;
}

.face {
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}

.flipped {
  transform: rotateY(180deg);
}
</style>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { GiftCode } from '~/types';
const { t } = useI18n();

import Card from '../layout/Card.vue';
import Link from './Link.vue';

const props = defineProps<{
  giftCode: GiftCode | null;
  isFlipped?: boolean;
}>();

const emit = defineEmits(['click', 'flipped']);

const flipped = ref(false);

watch(
  () => props.isFlipped,
  (newVal) => {
    if (newVal) {
      flipped.value = newVal;
    }
  }
);

const onGiftCardClick = () => {
  if (!props.giftCode) {
    emit('click');
    return;
  }

  flipped.value = !flipped.value;
  emit('flipped', flipped.value);
};
</script>
