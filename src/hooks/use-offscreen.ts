import { useState, useCallback, useEffect } from 'react';

export const useOffscreen = (onOffScreen: () => void) => {
  const [refEl, setRefEl] = useState<HTMLElement | null>(null);

  const refCallback = useCallback((el: HTMLElement | null) => {
    setRefEl(el);
  }, []);

  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        return;
      }

      onOffScreen();
    }, options);

    if (refEl) {
      observer.observe(refEl);
    }

    return () => {
      if (refEl) {
        observer.unobserve(refEl);
      }
    };
  }, [refEl]);

  return refCallback;
};
