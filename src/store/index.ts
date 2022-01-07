import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { BacktrackUser } from '~/types';

export const useStore = defineStore('main', () => {
  const state = reactive({
    user: {} as BacktrackUser<true, true>
  });

  const setUser = (user: BacktrackUser<true, true>) => {
    state.user = user;
  };

  return { state, setUser };
});
