import * as statsfm from '@statsfm/statsfm.js';
import Cookies from 'js-cookie';

let baseUrl = 'https://beta-api.stats.fm/api/v1';

if (process.env.NODE_ENV === 'development')
  baseUrl = 'https://beta-api.stats.fm/api/v1';

const ref = new statsfm.Api({
  baseUrl,
});

// TODO: maybe memoize the api based on a provided acces token or a piece of state which encloses the accestoken
export const useApi = () => {
  // use getApiInstance() for ssr instead of useApi();
  // try to set token when token is not set yet,
  // this is needed for when the first few requests happen before the accestoken is set
  // window check is needed to net try and get cookies during ssr (which will fail because js-cookie is browser based)
  // there should be a different api for ssr, but for now this is fine
  if (!ref.http.config.accessToken && typeof window !== 'undefined') {
    const token = Cookies.get('identityToken');
    ref.http.config.accessToken = token;
  }

  return ref;
};
