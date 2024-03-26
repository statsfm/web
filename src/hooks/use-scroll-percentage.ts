import { useCallback, useEffect } from 'react';

export const useScrollPercentage = (
  percentage: number,
  callback: () => void,
) => {
  const scrollCallback = useCallback(() => {
    const scrolledPercentage =
      (document.documentElement.scrollHeight / 100) * percentage;

    if (window.scrollY > scrolledPercentage) {
      callback();
      window.removeEventListener('scroll', scrollCallback);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', scrollCallback);
    return () => window.removeEventListener('scroll', scrollCallback);
  }, []);
};
