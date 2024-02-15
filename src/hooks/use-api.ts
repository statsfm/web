import * as statsfm from '@/utils/statsfm';
import Cookies from 'js-cookie';

let apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://beta-api.stats.fm/api';

if (process.env.NODE_ENV === 'development')
  apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://beta-api.stats.fm/api';

const ref = new statsfm.Api({
  http: {
    apiUrl,
  },
});

// TODO: maybe memoize the api based on a provided access token or a piece of state which encloses the accestoken
export const useApi = () => {
  // use getApiInstance() for ssr instead of useApi();
  // try to set token when token is not set yet,
  // this is needed for when the first few requests happen before the accesstoken is set
  // window check is needed to not try and get cookies during ssr (which will fail because js-cookie is browser based)
  // there should be a different api for ssr, but for now this is fine
  if (!ref.http.accessToken && typeof window !== 'undefined') {
    const token = Cookies.get('identityToken');
    ref.http.setToken(token);
  }

  return ref;
};
