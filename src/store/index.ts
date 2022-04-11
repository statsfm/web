import { defineStore } from 'pinia';
import { reactive } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';

export const useStore = defineStore('main', () => {
  const state: { user?: statsfm.UserPrivate } = reactive({
    user: undefined
  });

  const setUser = (user: any) => {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  };

  return { state, setUser };
});
