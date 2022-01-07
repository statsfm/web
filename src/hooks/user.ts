import { useStore } from '~/store';
import { BacktrackUser } from '~/types';

export function useUser(): BacktrackUser<true, true> | null {
  const store = useStore();
  return store.state.user;
}
