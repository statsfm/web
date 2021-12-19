import { Error, User } from "~/types";

export interface State {
  user: User | null;
  errors: Error[];
}

export const state: State = {
  user: null,
  errors: [],
};
