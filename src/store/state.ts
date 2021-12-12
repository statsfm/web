import { User } from "../types";

export interface State {
  user: User | null;
}

export const state: State = {
  user: null,
};
