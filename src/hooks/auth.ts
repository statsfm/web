import auth from '~/auth';

const ref = new auth();
export function useAuth(): auth {
  return ref;
}
