import * as statsfm from '@statsfm/statsfm.js';

const ref = new statsfm.Api({
  baseUrl: 'https://beta-api.stats.fm/api/v1',
});

export const useApi = () => {
  return ref;
};
