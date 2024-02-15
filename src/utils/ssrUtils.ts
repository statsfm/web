import type { UserPrivate } from '@/utils/statsfm';
import * as statsfm from '@/utils/statsfm';

export type SSRProps<T = {}> = {
  user?: UserPrivate | null | undefined;
} & T;

export const getApiInstance = (accessToken?: string) => {
  return new statsfm.Api({
    auth: {
      accessToken,
    },
    http: {
      apiUrl:
        process.env.NEXT_PUBLIC_API_URL ?? 'https://beta-api.stats.fm/api',
    },
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
