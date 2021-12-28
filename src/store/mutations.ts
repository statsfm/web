import { MutationTree } from 'vuex';
import { Error, User } from '../types';
import { State } from './state';

export const mutations: MutationTree<State> = {
  setUser(state, payload: User) {
    state.user = payload;
    localStorage.setItem('user', JSON.stringify(payload));
  },
  setError(state, payload: Error) {
    state.errors.push(payload);
  }
};
