import toasterContext from '@/context/toaster';
import { useContext } from 'react';

export const useToaster = () => {
  const { createToast } = useContext(toasterContext)!;
  const randomId = () => {
    return Date.now() + Math.random().toString(36).substring(2, 9);
  };

  return {
    message: (message: string, timeout?: number) =>
      createToast({ id: randomId(), message, timeout, variant: 'success' }),
    error: (message: string, timeout?: number) =>
      createToast({ id: randomId(), message, timeout, variant: 'error' }),
  };
};
