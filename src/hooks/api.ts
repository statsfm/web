import Api from '@statsfm/statsfm.js';

export function useApi(): Api {
  const ref = new Api({
    accessToken: localStorage.getItem('token')?.toString() ?? undefined
  });
  return ref;
}
