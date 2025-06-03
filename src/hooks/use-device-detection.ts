import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));
  }, []);

  const deviceType = isIOS ? 'ios' : 'android';

  return { isIOS, isAndroid, deviceType };
};
