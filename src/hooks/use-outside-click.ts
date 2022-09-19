import type { MutableRefObject } from 'react';
import { useEffect } from 'react';

export const useOutsideClick = (
  active: boolean,
  ignoreItems: MutableRefObject<HTMLElement | null>[],
  callback: (e: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // TODO: fix type
      if (
        ignoreItems.some((item) => item.current?.contains(event.target as any))
      ) {
        return;
      }

      callback(event);
    };

    if (active) {
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
    }

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [active, ignoreItems, callback]);
};
