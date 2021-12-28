import { GetterTree } from 'vuex';
import { User } from '../types';
import { State, state } from './state';

export const getters: GetterTree<State, State> = {
  getUser(): User | null {
    return state.user;
  }
};
