import { MutationTree } from "vuex";
import { User } from "../types";
import { State } from "./state";

export const mutations: MutationTree<State> = {
  setUser(state, payload: User) {
    state.user = payload;
  },
};
