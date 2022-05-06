import { useStore } from '~/store';
import * as statsfm from '@statsfm/statsfm.js';

export function useUser(): statsfm.UserPrivate | undefined {
  const store = useStore();
  return store.state.user;
}
