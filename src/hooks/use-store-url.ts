import { useRouter } from 'next/router';

import { useDeviceDetection } from './use-device-detection';
import { STORE_APPLE_URL, STORE_GOOGLE_URL } from '@/constants';

export const useStoreURL = () => {
  const router = useRouter();
  const { isIOS, isAndroid } = useDeviceDetection();

  let url = STORE_APPLE_URL;

  if (isIOS) {
    url = STORE_APPLE_URL;
  }

  if (isAndroid) {
    url = STORE_GOOGLE_URL;
  }

  const goToStore = () => {
    router.push(url);
  };

  return { url, goToStore };
};
