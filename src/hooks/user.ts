import { useStore } from "~/store";
import { User } from "~/types";

export function useUser(): User | null {
  const store = useStore();
  return store.state.user;
}
