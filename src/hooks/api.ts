import Api from '@statsfm/statsfm.js';

const ref = new Api({
  // baseUrl: 'https://beta-api.stats.fm/api/v1',
  baseUrl: 'http://localhost:3000/api/v1',
  accessToken: localStorage.getItem('token')?.toString() ?? undefined
});
export function useApi(): Api {
  return ref;
}
