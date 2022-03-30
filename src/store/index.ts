import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useStore = defineStore('main', () => {
  const state = reactive({
    user: undefined
  });

  const setUser = (user: any) => {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  };

  return { state, setUser };
});
