import { useStore } from '~/store';

export function useUser(): any {
  const store = useStore();
  return store.state.user;
}
