import { ElementRef, PropsWithChildren, forwardRef } from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

type AlertDialogContentProps =
  PropsWithChildren<AlertDialogPrimitive.AlertDialogContentProps>;

export const Content = forwardRef<
  ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ children, ...props }, forwardedRef) => {
  return (
    <AlertDialogPrimitive.Content
      ref={forwardedRef}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-foreground rounded-xl p-4 shadow-2xl max-w-lg"
      {...props}
    >
      {children}
    </AlertDialogPrimitive.Content>
  );
});
