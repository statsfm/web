import { Ref, watchEffect } from 'vue';

export const useClickAway = <T extends HTMLElement | undefined>(
  ref: Ref<T>,
  callback: (e: MouseEvent | TouchEvent) => void
) => {
  watchEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref || !ref.value || ref.value.contains(e.target as Node)) return;
      callback(e);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  });
};
