import toasterContext from '@/context/toaster';
import { useContext } from 'react';

export const useToaster = () => {
  const { createToast } = useContext(toasterContext)!;
  const randomId = () => {
    return Math.floor(Math.random() * 2000);
  };

  return {
    message: (message: string, timeout?: number) =>
      createToast({ id: randomId(), message, timeout, variant: 'success' }),
    error: (message: string, timeout?: number) =>
      createToast({ id: randomId(), message, timeout, variant: 'error' }),
  };
};
