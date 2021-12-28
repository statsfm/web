import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { InjectionKey } from 'vue';

import { State, state } from './state';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const key: InjectionKey<Store<State>> = Symbol();

const store = createStore({
  state,
  getters,
  mutations,
  actions
});

export function useStore() {
  return baseUseStore(key);
}

export default store;
