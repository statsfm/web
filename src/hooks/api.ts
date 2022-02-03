import Api from '~/api';
import auth from '~/auth';

export function useApi(): Api {
  const ref = new Api();
  return ref;
}
