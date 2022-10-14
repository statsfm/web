import { Container } from '@/components/Container';
import clsx from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { useState, createContext } from 'react';

type ToasterVariant = 'success' | 'error' | 'info';
type ToasterType = {
  id: number;
  message: string;
  variant?: ToasterVariant;
  timeout?: number;
  hidden?: boolean;
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
          toast.hidden ? 'opacity-0' : 'opacity-100',
          'max-h-max w-full animate-fade rounded-2xl bg-foreground p-5 text-center font-bold shadow-2xl transition-opacity'
        )}
      >
        {toast.message}
      </div>
    </li>
  );
};

export const ToasterContainer: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToasterType[]>([]);

  const removeToast = (id: number) => {
    // set hidden on toasts to true and remove them after a timeout
    setToasts((toasts) =>
      toasts.map((t) => {
        if (t.id === id) return { ...t, hidden: true };
        return t;
      })
    );
    setTimeout(() => {
      setToasts((toasts) => toasts.filter((t) => t.id !== id));
    }, 300);
  };

  const createToast = (toaster: ToasterType) => {
    setToasts([...toasts, toaster]);
    setTimeout(
      () => removeToast(toaster.id),
      toaster.timeout ? toaster.timeout : 5000
    );
  };

  return (
    <toasterContext.Provider value={{ createToast }}>
      {children}
      <div className="fixed bottom-0 left-0 z-50 w-full">
        <Container className="bg-transparent">
          {toasts.length > 0 && (
            <ul className="mb-10 flex flex-col gap-4">
              {toasts.slice(0, 5).map((toast) => (
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
