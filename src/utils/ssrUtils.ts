import type { UserPrivate } from '@statsfm/statsfm.js';
import * as statsfm from '@statsfm/statsfm.js';

export type SSRProps<T = {}> = {
  user: UserPrivate | null;
} & T;

export const getApiInstance = (accessToken?: string) => {
  return new statsfm.Api({
    baseUrl: 'https://beta-api.stats.fm/api/v1',
    accessToken,
  });
};

export const fetchUser = async (ctx: any): Promise<UserPrivate | null> => {
  const { identityToken } = ctx.req.cookies;
  const api = getApiInstance(identityToken);

  let user: UserPrivate | null;

  try {
    user = await api.me.get();
  } catch (e) {
    user = null;
  }

  return user;
};
