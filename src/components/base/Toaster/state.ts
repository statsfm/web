import { Ref, ref } from 'vue';
import { ToasterOptions } from '~/types';

export const errors: Ref<ToasterOptions[]> = ref([]);
