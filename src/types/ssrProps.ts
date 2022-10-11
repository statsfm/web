import type { UserPrivate } from '@statsfm/statsfm.js';

export type SSRProps<T = {}> = {
  user: UserPrivate | null;
} & T;
