import { useApi } from '@/hooks';
import type { UserPrivate } from '@statsfm/statsfm.js';

export type SSRProps<T = {}> = {
  user: UserPrivate | null;
} & T;

export const fetchUser = async (ctx: any): Promise<UserPrivate | null> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const api = useApi();

  const { identityToken } = ctx.req.cookies;
  api.http.config.accessToken = identityToken;

  let user: UserPrivate | null;

  try {
    user = await api.me.get();
  } catch (e) {
    user = null;
  }

  return user;
};
