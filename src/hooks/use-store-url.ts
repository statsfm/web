import { useRouter } from 'next/router';
import { useDeviceDetection } from './use-device-detection';

export const useStoreURL = () => {
  const router = useRouter();
  const { isIOS, isAndroid } = useDeviceDetection();

  let url = '#';

  if (isIOS) {
    url = 'https://apps.apple.com/app/spotistats-for-spotify/id1526912392';
  }

  if (isAndroid) {
    url = 'https://play.google.com/store/apps/details?id=dev.netlob.spotistats';
  }

  const goToStore = () => {
    router.push(url);
  };

  return { url, goToStore };
};
