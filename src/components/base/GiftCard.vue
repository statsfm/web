<template>
  <div
    class="perspective mb-5 flex aspect-[5/3] w-full max-w-xl cursor-pointer flex-col"
    @click="onGiftCardClick"
  >
    <div class="flip relative transition-transform duration-1000" :class="{ flipped }">
      <Card
        class="face absolute flex aspect-[5/3] items-center justify-center bg-[url('/images/giftcard_pattern.svg')] bg-contain"
      >
      </Card>
      <Card
        v-if="giftCode"
        class="face back absolute flex aspect-[5/3] select-none flex-col justify-center p-10"
      >
        <p v-if="giftCode.message" class="text-xl text-white">{{ giftCode.message }}</p>
        <p v-else class="text-xl font-normal italic text-white">
          {{ t('gift.no_message') }}
        </p>
        <span>
          <i18n-t keypath="gift.gifted_by">
            <template v-slot:name>
              <Link
                :to="{ name: 'User', params: { userId: giftCode.boughtBy.id } }"
                class="font-bold text-primary"
                >{{ giftCode.boughtBy.displayName }}</Link
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
import Card from '../layout/Card.vue';
import Link from './Link.vue';

const { t } = useI18n();

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
