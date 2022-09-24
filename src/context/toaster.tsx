import { Container } from '@/components/Container';
import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { useState, useCallback, createContext } from 'react';

type ToasterVariant = 'success' | 'error' | 'info';
type ToasterType = {
  id: number;
  message: string;
  variant?: ToasterVariant;
  timeout?: number;
};

type ToasterContextType = {
  createToast: (toaster: ToasterType) => void;
};

const toasterContext = createContext<ToasterContextType | null>(null);
export default toasterContext;

const Toaster: FC<{
  removeToast: (id: number) => void;
  toast: ToasterType;
}> = ({ removeToast, toast }) => {
  return (
    <li onClick={() => removeToast(toast.id)} className="hover:cursor-pointer">
      <div
        className={clsx(
          toast.variant === 'error' ? 'bg-red-500' : 'bg-primary text-black',
          'max-h-max w-full animate-fade rounded-2xl bg-foreground p-5 text-center font-bold shadow-2xl'
        )}
      >
        {toast.message}
      </div>
    </li>
  );
};

export const ToasterContainer: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToasterType[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const createToast = useCallback((toaster: ToasterType) => {
    setToasts((prev) => [...prev, toaster]);
    setTimeout(
      () => removeToast(toaster.id),
      toaster.timeout ? toaster.timeout * 10 : 5000
    );
  }, []);

  return (
    <toasterContext.Provider value={{ createToast }}>
      {children}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <Container className="bg-transparent">
          {toasts.length > 0 && (
            <ul className="mb-10 flex flex-col gap-4">
              {toasts.map((toast) => (
                <Toaster
                  removeToast={removeToast}
                  toast={toast}
                  key={toast.id}
                />
              ))}
            </ul>
          )}
        </Container>
      </div>
    </toasterContext.Provider>
  );
};
