import type { MutableRefObject } from 'react';
import { useEffect } from 'react';

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement | null>,
  callback: (e: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // TODO: fix type
      if (!ref.current || ref.current.contains(event.target as any)) {
        return;
      }

      callback(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
};
