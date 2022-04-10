import Api from '@statsfm/statsfm.js';

export function useApi(): Api {
  const ref = new Api({
    baseUrl: 'https://beta-api.stats.fm/api/v1',
    accessToken: localStorage.getItem('token')?.toString() ?? undefined
  });
  return ref;
}
