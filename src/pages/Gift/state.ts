import { ref, Ref } from 'vue';
import { GiftCode } from '~/types';

export const giftCodes: Ref<GiftCode[] | null> = ref(null);
