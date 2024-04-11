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
      apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.stats.fm/api',
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

export const getOrigin = (req: any): string => {
  let protocol = req.headers['x-forwarded-proto'] ?? 'https';
  if (process.env.NODE_ENV === 'development') protocol = 'http';

  const { host } = req.headers;

  return `${protocol}://${host}` ?? 'https://stats.fm';
};
