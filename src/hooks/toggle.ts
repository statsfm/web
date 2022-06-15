import { ref } from 'vue';

export const useToggle = (defaultState = false) => {
  const state = ref(defaultState);

  const off = () => {
    state.value = false;
  };

  const on = () => {
    state.value = true;
  };

  const toggle = () => {
    state.value = !state.value;
  };

  return {
    state,
    on,
    off,
    toggle
  };
};
