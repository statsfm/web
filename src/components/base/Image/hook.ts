import { Ref, ref } from 'vue';

type State = 'pending' | 'loading' | 'failed' | 'loaded' | 'unavailable';

export const useImageState = (
  src?: string
): { state: Readonly<Ref<State>>; img?: HTMLImageElement } => {
  const state: Ref<State> = ref('pending');

  if (!src) {
    state.value = 'unavailable';
    return {
      state
    };
  }

  const img = new Image();
  img.src = src;

  img.onloadstart = () => {
    state.value = 'loading';
  };

  img.onload = () => {
    state.value = 'loaded';
  };

  img.onerror = () => {
    state.value = 'failed';
  };

  return {
    state,
    img
  };
};
