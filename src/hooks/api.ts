import Api from '/Users/sjoerdbolten/Documents/Projects/statsfm.js/src/lib/StatsfmAPI';

export function useApi(): Api {
  const ref = new Api({ acccessToken: localStorage.getItem('token') ?? undefined });
  return ref;
}
